const articleRouter = require('express').Router()
const {getArticleById} = require('../controllers/article-controllers')

articleRouter.route('/:article_id')
.get(getArticleById)

module.exports = articleRouter