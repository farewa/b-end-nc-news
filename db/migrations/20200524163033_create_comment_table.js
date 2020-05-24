
exports.up = function(knex) {
  console.log('creating comment table')
  return knex.schema.createTable('comment', (commentTable) => {
    commentTable.increments('comment_id').primary()
    commentTable.string('author').references('user.username')
    commentTable.integer('article_id').references('article.article_id')
    commentTable.integer('votes').defaultTo(0)
    commentTable.timestamp('created_at').defaultTo(knex.fn.now())
    commentTable.text('body').notNullable()
  })
};

exports.down = function(knex) {
  console.log('dropping comment table')
  return knex.schema.dropTable('comment')
};
