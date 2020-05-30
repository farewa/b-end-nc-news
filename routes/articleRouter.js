const articleRouter = require('express').Router()
const { getArticleById, patchArticleById, postCommentByArticleId} = require('../controllers/article-controllers')

articleRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)


articleRouter.route('/:article_id/comments')
.post(postCommentByArticleId)

module.exports = articleRouter