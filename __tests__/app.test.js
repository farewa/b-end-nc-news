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
    it("tests that GET returns a status of 200 and the username object", () => {
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
          .then((response) => {
            expect(response.body.msg).to.eql(["Method Not Allowed"]);
          });
      });
      return Promise.all(methodsNotAllowed);
    });
  });
  describe("/articles/:article_id", () => {
    it("tests that GET returns a status of 200 and the specified article ", () => {
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
    it("tests that an article_id that is in the wrong format errors with status code 400", () => {
      return request(app)
        .get("/api/articles/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.eql("Bad Request");
        });
    });
  });
});
