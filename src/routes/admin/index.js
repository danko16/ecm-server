const express = require('express');
const login = require('./login');
const register = require('./register');

const admin = express.Router();

admin.use('/login', login);
admin.use('/register', register);

module.exports = admin;
