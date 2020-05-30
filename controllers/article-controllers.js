const {fetchArticleById} = require('../models/article-models')

exports.getArticleById = (req, res) => {
  const {article_id} = req.params
  fetchArticleById(article_id)
    .then((article) => res.status(200).send({article}))
}