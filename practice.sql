\c nc_news_test

/* 
count of the films by each director

I want, count of all the comments with a specific article_id 

Join two tables together, articles & comments, and use a leftjoin so that articles 
with no comments don't get lost

I WANT TO COMMENT ALL OF THE comments.article_id AS comment_count FROM THE COMMENTS TABLE THAT ARE
ASSOCIATED WITH THE ARTICLES AND GROUP THEM ALL TOGETHER BY THE aricles.article_id

FOR EVERY article_id, how many comments were there?
 
*/

SELECT articles.article_id, articles.title, COUNT(comments.article_id) AS comment_count FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id




