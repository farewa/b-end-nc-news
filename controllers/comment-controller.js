const {updateCommentById} = require('../models/comment-models')

exports.patchCommentById = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    updateCommentById(comment_id, inc_votes)
    .then(comment => res.status(201).send({comment}))
}