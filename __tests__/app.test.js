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
});
