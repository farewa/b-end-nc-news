const connection = require("../db/connection");

exports.fetchUserByUsername = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("users.username", username)
    .then(([user]) => {
      if (!user) return Promise.reject({status: 404, message: 'Route not found'})
      else return user
    })
};
