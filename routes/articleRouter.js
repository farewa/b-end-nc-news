const articleRouter = require('express').Router()
const { getArticleById, patchArticleById, postCommentByArticleId, getCommentByArticleId, getAllArticles} = require('../controllers/article-controllers')
const {methodNotAllowed} = require('../errors')

articleRouter.route('/')
.get(getAllArticles)
.all(methodNotAllowed)

articleRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)
.all(methodNotAllowed)

articleRouter.route('/:article_id/comments')
.get(getCommentByArticleId)
.post(postCommentByArticleId)
.all(methodNotAllowed)


module.exports = articleRouter