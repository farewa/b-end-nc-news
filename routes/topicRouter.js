const topicRouter = require('express').Router()
const {getTopics, postTopic} = require('../controllers/topic-controllers')
const {methodNotAllowed} = require('../errors')

topicRouter.route('/')
.get(getTopics)
.post(postTopic)
.all(methodNotAllowed)

module.exports = topicRouter 