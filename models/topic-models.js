const connection = require("../db/connection");

exports.sendTopics = () => {
  return connection.select("*").from("topics").returning("*");
};
