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
    it("tests status 404: GET request errors when trying to delete a valid user_id that does not exist", () => {
      return request(app)
      .get('/api/users/not-a-username')
      .expect(404)
      .then(({body: {message}}) => {
        expect(message).to.eql('Route not found')
      })
    })
    });
  });
  describe('/articles', () => {
    it('tests status 200: GET request returns an array of article objects', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).to.be.an('array')
        expect(articles[0]).to.have.all.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
      })
    })
    it('tests status 201: POST request returns the newly posted article', () => {
      return request(app)
      .post("/api/articles")
      .send({title: 'paper maché', 
             body: 'did anybody else use paper maché a bit too much when they were in primary school?',
             topic: 'paper', 
             author: 'butter_bridge'})
      .expect(201)
      .then(({body: {article}}) => {
        expect(article).include(
          {title: 'paper maché',
          body: 'did anybody else use paper maché a bit too much when they were in primary school?',
          votes: 0,
          topic: 'paper',
          author: 'butter_bridge'}
        )
        expect(article).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at')
      })
    })
    describe('queries', () => {
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
      it('tests status 200: GET request returns a limited number of articles with a limit query', () => {
        return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({body: {articles}}) => {
          expect(articles.length).to.equal(5)
        })
      })
      it('tests status 200: GET request returns a limited number of articles from a specific page when passed both queries', () => {
        return request(app)
        .get('/api/articles?limit=5&page=2')
        .expect(200)
        .then(({body: {articles}}) => {
          expect(articles[0].title).to.eql('A')
          expect(articles.length).to.equal(5)
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
      it('tests status 200: GET request tests that ordering by neither asecending or descending ignores request as sends back articles', () => {
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
          expect(articles.length).to.equal(0)
        })
      })
      it("tests status 200: GET request does not error when querying for a topic that exists with no articles", () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body: {articles}}) => {
          expect(articles).to.be.an('array')
          expect(articles.length).to.equal(0)
        })
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
        const methods = ["put", "delete", "patch"];
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
          expect(message).to.eql('Route not found')
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
    it('tests status 200: GET request responds with an empty array when the article_id exists but has no comments', () => {
      return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments).to.be.an('array')
        expect(comments.length).to.equal(0)
      })
    })
    describe('queries', () => {
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
      it("tests status 200: GET request returns a limited number of comments with a limit query", () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({body: {comments}}) => {
          expect(comments.length).to.equal(5)
        })
      })
      it("GET request returns a limited number of comments from a specific page when passed both queries", () => {
        return request(app)
        .get('/api/articles/1/comments?limit=2&page=2')
        .expect(200)
        .then(({body: {comments}}) => {
          expect(comments.length).to.equal(2)
          expect(comments[0].body).to.eql(' I carry a log — yes. Is it funny to you? It is not to me.')
        })
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
      it('tests status 404: GET request errors when given a valid article_id that does not exist', () => {
        return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then(({body: {message}}) => {
          expect(message).to.eql('Route not found')
        })
      })
      it('tests status 400: POST request errors when not all of the required keys are given', () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "the weather outside Northcoders is particularly bright today"
        })
        .expect(400)
        .then(({body: {message}}) => {
          expect(message).to.eql('Bad Request')
        })
      })
      it('tests status 404: POST request errors when posting to a valid article_id that does not exist', () => {
        return request(app)
        .post('/api/articles/1000/comments')
        .send({
          username: "icellusedkars",
          body: "the weather outside Northcoders is particularly bright today"})
        .expect(404)
        .then(({body: {message}}) => {
          expect(message).to.eql('Route not found')
        })
      })
    })
  });
  describe('/comments/:comment_id', () => {
    it("tests status 200: PATCH request responds with the newly updated comment", () => {
      return request(app)
      .patch('/api/comments/1')
      .send({inc_votes : 1 })
      .expect(200)
      .then(({body: {comment}}) => {
        expect(comment.votes).to.equal(17)
        expect(comment).to.have.all.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
      })
    })
    it('tests status 200: PATCH request ignores a body that is sent with no inc_votes', () => {
      return request(app)
      .patch('/api/comments/2')
      .send()
      .expect(200)
      .then(({body: {comment}}) => {
        expect(comment).to.have.all.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
        expect(comment.votes).to.not.change
      })
    })
    it("tests status 204: DELETE request responds with the correct status and no content", () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204)
    })
    describe('errors', () => {
      it('tests status 405: that all other methods are not able to be used on this endpoint', () => {
        const methods = ['get', 'post', 'put']
        const invalidMethods = methods.map((method) => {
          return request(app)
          [method]('/api/comments/2')
          .expect(405)
          .then(({body: {message}}) => {
            expect(message).to.eql('Method Not Allowed')
          })
        })
        return Promise.all(invalidMethods)
      })
      it('tests status 404: PATCH request errors when posting to a valid comment_id that does not exist', () => {
        return request(app)
        .patch('/api/comments/1000')
        .send({ inc_votes : 1 })
        .expect(404)
        .then(({body: {message}}) => {
          expect(message).to.eql('Route not found')
        })
      })
      it('tests status 404: DELETE request errors when trying to delete a valid comment_id that does not exist', () => {
        return request(app)
        .delete('/api/comments/1000')
        .expect(404)
        .then(({body: {message}}) => {
          expect(message).to.eql('Route not found')
        })
      })
    })
  })
  it('responds with JSON with endpoints', () => {
    return request(app)
    .get('/api')
    .expect(200)
  })
});
