const commentRouter = require('express').Router()
const {patchCommentById, deleteCommentById} = require('../controllers/comment-controller')
const {methodNotAllowed} = require('../errors')

commentRouter.route('/:comment_id')
.patch(patchCommentById)
.delete(deleteCommentById)
.all(methodNotAllowed)


module.exports = commentRouter