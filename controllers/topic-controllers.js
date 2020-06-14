const {sendTopics, insertTopic} = require('../models/topic-models')

exports.getTopics = (req, res, next) => {
  sendTopics()
    .then((topics) => res.status(200).send({topics}))
    .catch(next)
}

exports.postTopic = (req, res, next) => {
  const {slug, description} = req.body
  const newTopic = {slug, description}
  insertTopic(newTopic)
  .then((topic) => res.status(201).send({topic}))
  .catch(next)
}