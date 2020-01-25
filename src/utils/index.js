const response = require('./response');
const Jwt = require('./jwt');
const auth = require('./auth');

module.exports = {
  auth,
  jwt: new Jwt(),
  response
};
