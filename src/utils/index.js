const response = require('./response');
const Jwt = require('./jwt');
const JwtAdmin = require('./jwt-admin');
const auth = require('./auth');
const adminAuth = require('./admin-auth');

module.exports = {
  auth,
  adminAuth,
  jwt: new Jwt(),
  jwtAdmin: new JwtAdmin(),
  response
};
