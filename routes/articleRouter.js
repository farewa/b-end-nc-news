const articleRouter = require('express').Router()
const { getArticleById, patchArticleById, postCommentByArticleId, getCommentByArticleId, getAllArticles} = require('../controllers/article-controllers')

articleRouter.route('/')
.get(getAllArticles)

articleRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)


articleRouter.route('/:article_id/comments')
.post(postCommentByArticleId)
.get(getCommentByArticleId)


module.exports = articleRouter