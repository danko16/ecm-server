const express = require('express');
const login = require('./login');
const register = require('./register');

const v1 = express.Router();

v1.use('/login', login);
v1.use('/register', register);

module.exports = v1;
