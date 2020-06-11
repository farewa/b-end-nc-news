const topicRouter = require('express').Router()
const {getTopics} = require('../controllers/topic-controllers')
const {methodNotAllowed} = require('../errors')

topicRouter.route('/')
.get(getTopics)
.all(methodNotAllowed)

module.exports = topicRouter 