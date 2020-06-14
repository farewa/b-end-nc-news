const connection = require("../db/connection");

exports.sendTopics = () => {
  return connection.select("*").from("topics").returning("*");
};

exports.insertTopic = (newTopic) => {
  return connection('topics')
  .insert(newTopic)
  .returning('*')
  .then(([topic]) => topic)
}