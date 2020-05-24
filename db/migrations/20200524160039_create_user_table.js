exports.up = function (knex) {
  console.log("creating user table");
  return knex.schema.createTable("user", (userTable) => {
    userTable.string("username").unique().primary();
    userTable.string("avatar_url").notNullable();
    userTable.string("name").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping user table")
  return knex.schema.dropTable("user")
};
