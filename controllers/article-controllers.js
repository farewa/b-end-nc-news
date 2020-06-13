const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchCommentByArticleId
} = require("../models/article-models");

exports.getAllArticles = (req, res, next) => {
  const {sort_by, order, author, topic, limit, page} = req.query
  fetchAllArticles(sort_by, order, author, topic, limit, page)
    .then((articles) => res.status(200).send({articles}))
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
  .then((article) => res.status(200).send({ article }))
  .catch(next)
};

exports.getCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  const {sort_by, order, limit} = req.query
  fetchCommentByArticleId(article_id, sort_by, order, limit)
  .then((comments) => res.status(200).send({comments}))
  .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  const {username, body} = req.body
  const newComment = {article_id, author: username, body} 
  insertCommentByArticleId(newComment)
  .then((comment) => res.status(201).send({comment}))
  .catch(next)
}


