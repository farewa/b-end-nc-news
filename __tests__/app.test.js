process.env.NODE_ENV = "test"; // setting environment to test
const { expect } = require("chai");
const app = require("../app"); // the app that we want to test
const request = require("supertest"); // allows us to mimic url request
const connection = require("../db/connection"); //

describe("/api", () => {
  beforeEach(() => connection.seed.run()); // allows database to be reseeded before every test
  after(() => connection.destroy()); // stops tests hanging

  describe("/topics", () => {
    it("tests that GET returns a status of 200 and all of the topics", () => {
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
  });
  describe("/users/:username", () => {
    it("tests status 200: GET request returns a username object and the correct status code", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.have.all.keys("username", "avatar_url", "name");
        });
    });
    xit("tests that all other methods are not able to used on this endpoint", () => {
      const methods = ["post", "put", "delete", "patch"];
      const methodsNotAllowed = methods.map((method) => {
        return request(app)
          [method]("api/users/icellusedkars")
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).to.eql(["Method Not Allowed"]);
          });
      });
      return Promise.all(methodsNotAllowed);
    });
  });
  describe("/articles/:article_id", () => {
    it("tests status 200:  GET request returns correct status and the specified article ", () => {
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
    it("tests status 200: PATCH request responds with an article with the updated votes and the correct status code", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: {article} }) => {
          expect(article.votes).to.eql(1);
        });
    });
    it("tests status 200: PATCH request with an empty body responds with the article unchanged", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(200)
        .then(({ body: {article} }) => {
          expect(article).to.not.change
        });
    });
    it("tests status 400: GET request for an article_id that is in the wrong format errors with correct status code", () => {
      return request(app)
        .get("/api/articles/dog")
        .expect(400)
        .then(({ body: {message} }) => {
          expect(message).to.eql("Bad Request");
        });
    });
    it("tests status 404: GET request for an article_id that does not exist errors with correct status code ", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: {message} }) => {
          expect(message).to.eql("article_id does not exist");
        });
    });
  });
});
