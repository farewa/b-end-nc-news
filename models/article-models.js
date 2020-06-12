const connection = require("../db/connection");

exports.fetchAllArticles = (sort_by, order, author, topic) => {
  return connection
  .select(
    "articles.author", 
    "articles.title", 
    "articles.article_id", 
    "articles.topic", 
    "articles.created_at", 
    "articles.votes")
  .from("articles")
  .leftJoin("comments", "comments.article_id", "articles.article_id")
  .groupBy("articles.article_id")
  .count("comments.article_id as comment_count")
  .orderBy(sort_by || 'created_at', order || 'desc')
  .modify((query) => {
    if (author) query.where("articles.author", author)
    if (topic) query.where("articles.topic", topic)
  })
  .then((articles) => {
    if (articles.length !== 0) return [articles]
    else {
      if (author) return Promise.all([articles, queryChecker('username', 'users', author)])
      else if (topic) return Promise.all([articles, queryChecker('slug', 'topics', topic)])  
    }
    // else if (!articles.length && author) return Promise.all([articles, queryChecker(author)])
  })
  .then(([ articles, ifExists]) => {
    if (ifExists || articles.length) return articles
    // else return Promise.reject({status: 404, message: 'Route Not Found'})
  })
}

const queryChecker = (column, table, value) => {
  return connection
  .select(column)
  .from(table)
  .where({[column]: value})
  .then((response)=> {
    if (response.length === 0) return Promise.reject({status: 404, message: 'Route Not Found'})
    else return true
  })
}

exports.fetchArticleById = (article_id) => {
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .where("articles.article_id", article_id)
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article)
        return Promise.reject({
          status: 404,
          message: "article_id does not exist",
        });
      else return article;
    });
};

exports.updateArticleById = (article_id, inc_votes = 0) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then(([article]) => article);
};

exports.insertCommentByArticleId = (newComment) => {
  return connection("comments")
    .insert(newComment)
    .returning("*")
    .then(([comment]) => comment);
};

exports.fetchCommentByArticleId = (article_id, sort_by, order) => {
  return connection("comments")
    .select(
      "comments.comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.author",
      "comments.body"
    )
    .from('comments')
    .where("comments.article_id", article_id)
    .orderBy(sort_by || "created_at", order || 'desc')
    .then((article) =>{
      if (!article.length) return Promise.reject({status: 404, message: "Route not found"})
      else return article
    })
};
