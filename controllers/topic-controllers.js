const {sendTopics} = require('../models/topic-models')

exports.getTopics = (req, res, next) => {
  sendTopics()
    .then((topics) => {
      res.status(200).send({topics})
    })
    .catch(err => console.log(err))
}