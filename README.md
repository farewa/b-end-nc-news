## Northcoders News API

This project is a northcoders social news RESTful API that was created in order to create a Reddit site frontEnd single page app.

The current [frontEnd](https://github.com/farewa/frontEnd-nc-news/tree/master/src) project is still being built but can be found here


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

#### Prerequisites

In order to get a copy of the this project on your machine, you will need to download [Node.js](https://nodejs.org/en/download/). This will also make sure that [NPM](https://www.npmjs.com/) is downloaded.

To ensure that this has worked correctly, type the following in the terminal

```
node -v
npm -v
```
This will tell you the versions of Node.js and NPM that have been installed.

### Installation

#### Linux

If you are using a linux machine, you will have to do the following 

```
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install git && curl postgresql postgresql-contrib && touch ~/.bash_profile && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash && source ~/.nvm/nvm.sh && nvm install node && nvm use node && sudo -u postgres createuser --superuser $USER
```
This will install **Git** , **Node.js** and **PSQL**

You will then need to setup *PSQL*

In the terminal, type

```
psql
```
Then enter the following where *username* is your linux username and *secret_password* is a password of your own choosing. Make sure to wrap your password in single quotation marks.

```
ALTER USER username WITH PASSWORD 'secret_password';
```
Then you can exit psql in the terminal by typing `\q`


#### Accessing project

Navigate to the folder you want to save the project to in your terminal

Then, type the following:

```
git clone https://github.com/farewa/b-end-nc-news.git
```

To install all the packages, navigate into the project that you have just cloned and type

```
npm i
```

### Creating and seeding the databases

There are two databases for this project - `nc_news` for development and `nc_news_test` for testing. To set these up, do the following

Run the "setup-dbs" script 

```
npm run setup-dbs
```

### Connecting to the databases

In the root folder of the project, create a `knexfile.js` and copy and paste the following adding your linux username and the `psql` password that you created.

```js
// knexfile.js

const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      // username: 'username',
      // password: 'secret_password'
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      // for linux users:
      // username: 'username',
      // password: 'secret_password'
    },
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```
The `knexfile.js` has been *gitignored* so that your private configuration details cannot be seen.

There are two scripts to seed the databases with data. To seed ncs_news_test with the test data, type
```
npm run seed-test
```

To seed nc_news with development data, type

```
npm run seed
```

### Starting the app

If you would like to have a look at the app locally, you can run the command below and use an API testing tool like [Insomnia](https://support.insomnia.rest/) to test the different API endpoints on your machine.

```
npm run start
```

You will need to make sure that you have seeded the database first.


When you are finished with the server, press `ctrl + c`

Alternatively, you can see all the available endpoints and access the data by using the [hosted version](https://b-end-nc-news-app.herokuapp.com/api).

### Testing

All endpoints were tested.

To run the test script, type

```
npm test
```

To see the util function tests that were used to manipulate the data before seeding, type

```
npm run test-util
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
