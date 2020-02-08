const response = require('./response');
const Jwt = require('./jwt');
const JwtAdmin = require('./jwt-admin');
const auth = require('./auth');
const admin = require('./admin');

module.exports = {
  auth,
  admin,
  jwt: new Jwt(),
  jwtAdmin: new JwtAdmin(),
  response
};
