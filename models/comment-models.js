const connection = require('../db/connection')

exports.updateCommentById = (comment_id, inc_votes = 0) => {
    return connection('comments')
    .where('comment_id', comment_id)
    .increment({votes: inc_votes})
    .returning('*')
    .then(([article]) => {
        if (!article) return Promise.reject({status: 404, message: 'Route not found'})
        else return article
    })
}

exports.removeCommentById = (comment_id) => {
    return connection('comments')
    .where('comment_id', comment_id)
    .delete()
    .then((response) => {
        if (response) return true
    })
}