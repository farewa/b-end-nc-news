const connection = require("../db/connection");

exports.fetchAllArticles = (sort_by, order, author, topic, limit = 10, page = 1) => {
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
  .limit(limit)
  .offset(page * limit - limit)
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
  })
  .then(([ articles, ifExists]) => {
    if (ifExists || articles.length) return articles
  })
}

const queryChecker = (column, table, value) => {
  return connection
  .select(column)
  .from(table)
  .where({[column]: value})
  .then((response)=> {
    if (response.length === 0) return Promise.reject({status: 404, message: 'Route not found'})
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
  if (Object.values(newComment).includes(undefined)) return Promise.reject({status: 400, message: 'Bad Request'})
  return connection("comments")
    .insert(newComment)
    .returning("*")
    .then(([comment]) => {
      if (!comment) return Promise.reject({status: 404, message: 'Route not found'})
      else return comment
    });
};

exports.fetchCommentByArticleId = (article_id, sort_by, order, limit = 10, page = 1) => {
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
    .limit(limit)
    .offset(page * limit - limit)
    .orderBy(sort_by || "created_at", order || 'desc')
    .then((comments) => {
      if (comments.length !== 0) return [comments]
      else return Promise.all([comments, queryChecker('article_id', 'articles', article_id)])
    })
    .then(([comments, ifExists]) => {
      if (ifExists || comments.length) return comments
    })
};

exports.insertArticle = (newArticle) => {
  return connection('articles')
  .insert(newArticle)
  .returning('*')
  .then(([article]) => article)
}
