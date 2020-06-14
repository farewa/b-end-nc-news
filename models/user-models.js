const connection = require("../db/connection");

exports.fetchAllUsers = () => {
  return connection
  .select('*')
  .from('users')
  .returning('*')
  .then((users) => users)
  
}

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

exports.insertNewUser = (newUser) => {
  if (!newUser.username ||!newUser.name === undefined) return Promise.reject({status: 400, message: 'Bad Request'})
  return connection('users')
  .insert(newUser)
  .returning('*')
  .then(([user]) => {
    if (!user) return Promise.reject({status: 404, message: 'Route not found'})
    else return user
  })
}