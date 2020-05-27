const {
  topicData,
  articleData,
  commentsData,
  userData,
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  console.log("in seed file");
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticleData = formatDates(articleData);
      return knex("articles").insert(formattedArticleData).returning("*");
    })
    .then((articleRows) => {
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentsData, articleRef);
      return knex("comments").insert(formattedComments).returning("*");
    });
};
