const {
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchCommentByArticleId
} = require("../models/article-models");

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

exports.postCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  const {username, body} = req.body
  const newComment = {article_id, author: username, body} // because that's the format what the table for comment requires
  insertCommentByArticleId(newComment)
  .then((comment) => res.status(201).send({comment}))
}

exports.getCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  fetchCommentByArticleId(article_id)
  .then((comments) => res.status(200).send({comments}))
}
