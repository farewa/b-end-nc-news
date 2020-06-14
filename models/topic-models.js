const connection = require("../db/connection");

exports.sendTopics = () => {
  return connection.select("*").from("topics").returning("*");
};

exports.insertTopic = (newTopic) => {
  if (Object.values(newTopic).includes(undefined)) return Promise.reject({status: 400, message: 'Bad Request'})
  return connection('topics')
  .insert(newTopic)
  .returning('*')
  .then(([topic]) => {
    if (!topic) return Promise.reject({status: 404, message: 'Route not found'})
    else return topic
  })
}