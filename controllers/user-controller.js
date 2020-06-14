const {fetchUserByUsername, insertNewUser} = require('../models/user-models')


exports.getUserByUsername = (req, res, next) => {
  const {username} = req.params
  fetchUserByUsername(username)
  .then((user) => res.status(200).send({user}))
  .catch(next)
}

exports.postNewUser = (req, res, next) => {
  const {username, avatar_url, name} = req.body
  const newUser = {username, avatar_url, name}
  insertNewUser(newUser)
  .then((user) => res.status(201).send({user}))
  .catch(next)
}
