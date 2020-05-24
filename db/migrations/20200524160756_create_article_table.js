exports.up = function (knex) {
  console.log("creating article table");
  return knex.schema.createTable("article", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("topic.slug");
    articleTable.string("author").references("user.username");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  console.log("dropping article table");
  return knex.schema.dropTable("article");
};
