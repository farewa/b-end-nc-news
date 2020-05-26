process.env.NODE_ENV = "test";
const {expect} = require('chai')
const app = require('../app')
const request = require('supertest')

describe('/api', () => {
  
  describe('/topics', () => {
    it('tests that GET returns a status of 200 and all of the topics', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({body}) => {
        console.log(body)
      })
    });
  });
});


