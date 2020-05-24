const ENV = process.env.NODE_ENV || 'development';

const development = require('./development-data')
const test = require('./test-data')


const data = {
  development,
  test
};

module.exports = data[ENV];

// creating an ENV variable that will help us to decide which set of data to use (test or dev data)
// the appropriate data is being exported depending on whether or not it's test or dev data

