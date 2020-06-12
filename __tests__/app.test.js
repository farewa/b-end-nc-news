process.env.NODE_ENV = "test"; 
const chai = require('chai')
const {expect} = chai
chai.use(require("sams-chai-sorted"));

const app = require("../app"); 
const request = require("supertest"); 
const connection = require("../db/connection"); 

describe("/api", () => {
  beforeEach(() => connection.seed.run()); 
  after(() => connection.destroy()); 

  describe("/topics", () => {
    it("tests that GET returns a status of 200 and the topics array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(3);
          expect(topics[0]).to.eql({
            slug: "mitch",
            description: "The man, the Mitch, the legend",
          });
        });
    });
    describe('errors', () => {
      it('tests status 405: that all other methods are not able to be used on this endpoint', () => {
        const methods = ["post", "put", "delete", "patch"];
        const methodsNotAllowed = methods.map((method) => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.eql("Method Not Allowed");
            });
        });
        return Promise.all(methodsNotAllowed)
      })
    })
  });
  describe("/users/:username", () => {
    it("tests status 200: GET request returns a username object and the correct status code and message", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.have.all.keys("username", "avatar_url", "name");
        });
    });
    describe("errors", () => {
    it("tests status 405: that all other methods are not able to used on this endpoint", () => {
        const methods = ["post", "put", "delete", "patch"];
        const methodsNotAllowed = methods.map((method) => {
          return request(app)
            [method]("/api/users/icellusedkars")
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.eql("Method Not Allowed");
            });
        });
        return Promise.all(methodsNotAllowed)
      });
    });
  });
  describe('/api/articles', () => {
    it('tests status 200: GET request returns an array of article objects', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).to.be.an('array')
        expect(articles[0]).to.have.all.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
      })
    })
    it('tests status 200: GET request can accept a sort by query', () => {
      return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({body : {articles}}) => {
        expect(articles).to.be.sortedBy('votes', {descending: true})
      })
    })
    it('tests status 200: GET request can accept an order query', () => {
      return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({body : {articles}}) => {
        expect(articles).to.be.sortedBy('created_at', {descending: false})
      })
    })
    it("tests status 200: GET request returns filtered article array with only the articles relating to a specific author", () => {
      return request(app)
      .get('/api/articles?author=butter_bridge')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles[0].author).to.eql('butter_bridge')
      })
    })
    it("tests status 200: GET request returns filtered article with only the articles relating to a specific topic", () => {
      return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({body : {articles}}) => {
        expect(articles[0].topic).to.eql('mitch')
      })
    })
    it('tests status 200: tests that ordering by neither asecending or descending ignores request as sends back articles', () => {
      return request(app)
      .get("/api/articles?order=cat")
      .expect(200)
      .then(({body : {articles}}) => {
        expect(articles).to.be.an('array')
        expect(articles[0]).to.have.all.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
      })
    })
    it("tests status 200: GET request does not error when querying for an author that exists with no articles", () => {
      return request(app)
      .get('/api/articles?author=lurker')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).to.be.an('array')
      })
    })
    describe('errors', () => {
      it('tests status 400: tests that sorting by a column that does not exists errors with a bad request', () => {
        return request(app)
        .get('/api/articles?sort_by=apples')
        .expect(400)
        .then(({body : {message}}) => {
          expect(message).to.eql('Bad Request')
        })
      })
      it("tests status 405: that all other methods are not able to used on this endpoint", () => {
        const methods = ["post", "put", "delete", "patch"];
        const methodsNotAllowed = methods.map((method) => {
          return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(({body: {message}}) => {
            expect(message).to.eql('Method Not Allowed')
          })
        })
        return Promise.all(methodsNotAllowed)
      })
      it('tests status 404: tests that passing a query with an author that does not exist errors with route not found', () => {
        return request(app)
        .get('/api/articles?author=not-an-author')
        .expect(404)
        .then(({body : {message}}) => {
          expect(message).to.eql('Route Not Found')
        })
      })
    })
  })
  describe("/articles/:article_id", () => {
    it("tests status 200: GET request returns correct status and the specified article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.all.keys(
            "article_id",
            "comment_count",
            "author",
            "body",
            "title",
            "topic",
            "votes",
            "created_at"
          );
        });
    });
    it("tests status 200: PATCH request responds with an article object with the updated votes and the correct status code", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.eql(1);
        });
    });
    it("tests status 200: PATCH request with an empty body responds with the article object unchanged", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.not.change;
        });
    });
    describe("errors", () => {
      it("tests status 405: that all other methods are not able to used on this endpoint", () => {
        const methods = ['put', 'delete', "post"]
        const methodsNotAllowed = methods.map((method) => {
          return request(app)
          [method]('/api/articles/1')
          .expect(405)
          .then(({body : {message}}) => {
            expect(message).to.eql('Method Not Allowed')
          })
        })
        return Promise.all(methodsNotAllowed)
      })
      it("tests status 400: GET request for an article_id that is in the wrong format errors with correct status code and message", () => {
        return request(app)
          .get("/api/articles/dog")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).to.eql("Bad Request");
          });
      });
      it("tests status 404: GET request for an article_id that does not exist errors with correct status code and message", () => {
        return request(app)
          .get("/api/articles/9999")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).to.eql("article_id does not exist");
          });
      });
      it("tests status 400: PATCH request responds with correct status code and message when passed a body with an incorrect format", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "dog" })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).to.eql("Bad Request");
          });
      });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("tests status 201: POST request returns the newly posted comment object", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "icellusedkars",
          body: "the weather outside Northcoders is particularly bright today",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it("tests status 200: GET request returns an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an("array");
          expect(comments[0]).to.have.all.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
        });
    });
    it("tests status 200: GET request returns a sorted array of comments when passed a sort_by query", () => {
      return request(app)
      .get('/api/articles/1/comments?sort_by=votes')
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments).to.be.sortedBy('votes', {descending: true})
      })
    })
    it('tests status 200: GET request returns a sorted array sorted by order but defaults to descending when a specifier is not passed', () => {
      return request(app)
      .get("/api/articles/1/comments?order=asc")
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments).to.be.sorted({descending: false})
      })
    })
    describe('errors', () => {
      it("tests status 405: that all other methods are not able to used on this endpoint", () => {
        const methods = ['put', 'patch', 'delete']
        const methodsNotAllowed = methods.map((method) => {
          return request(app)
          [method]('/api/articles/1/comments')
          .expect(405)
          .then(({body: {message}}) => {
            expect(message).to.eql('Method Not Allowed')
          })
        })
        return Promise.all(methodsNotAllowed)
      })
    })
  });
});
