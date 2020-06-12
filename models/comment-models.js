const connection = require('../db/connection')

exports.updateCommentById = (comment_id, inc_votes) => {
    return connection('comments')
    .where('comment_id', comment_id)
    .increment({votes: inc_votes})
    .returning('*')
    .then(([article]) => article)
}

exports.removeCommentById = (comment_id) => {
    return connection('comments')
    .where('comment_id', comment_id)
    .delete()
    .then((response) => {
        if (response) return true
    })
}