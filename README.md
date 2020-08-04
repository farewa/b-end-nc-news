## Northcoders News API

This project is a northcoders social news RESTful API that was created in order to create a Reddit site frontEnd single page app.


### Hosting

The API is posted on Heroku and can visited [here](https://b-end-nc-news-app.herokuapp.com/api) where all the endpoints and example responses can be seen.

### Built with
[Express](https://expressjs.com/)

[PSQL](https://www.postgresql.org/docs/9.3/app-psql.html)

[Knex.js](https://knexjs.org/)

[Node](https://nodejs.org/en/)

[npm](https://www.npmjs.com/get-npm)

[Mocha](https://mochajs.org/)

[Chai](https://www.chaijs.com/)

### Getting started

In order to get a copy of the this project on your machine, follow these steps

```
https://github.com/ibi30/b-end-nc-news.git
```
Navigate to the correct directory and install node dependencies

```
npm i
```
In the root folder of the project, create a `knexfile.js` and copy and paste the following

```js
// knexfile.js

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      // user,
      // password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // user,
      // password
    }
  },

};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

Run the "setup:dbs" script

```
npm run setup:dbs
```
Run the "seed:run" script

```
npm run seed:run
```
Run a local version

```
npm run start
```
Use an API testing tool like [Insomnia](https://support.insomnia.rest/) to test the different API endpoints on your machine.

When you are finished with the server, press ctrl + c

To run the test script 

```
npm test
```

### Available routes and methods


* GET `/api/topics`
    * responds with an array of all topics"
* POST `/api/topics`
    * posts a new topic object
* GET `/api/users`
    * responds with an array of all users
* POST `/api/users`
    * posts a new user
* GET `/api/users/:username`
    * responds with a single user 
* GET `/api/articles`
    * responds with an array of all articles
* POST `/api/articles`
    * posts a new article
* GET `/api/articles/:article_id`
    * responds with a single article
* PATCH `/api/articles/:article_id`
    * responds with the updated article
* DELETE `/api/articles/:article_id`
    * responds with the correct status code and no content
* GET `/api/articles/:article_id/comments`
    * responds with an array with comments all with the associated article_id
* POST `/api/articles/:article_id/comments`
    * posts a new comment with the associated article_id
* PATCH `/api/comments/:comment_id`
    * responds with the updated comment
* DELETE `/api/comments/:comment_id`
    * responds with the correct status code and no content
