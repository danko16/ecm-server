const { auth } = require('@utils');
const express = require('express');
const login = require('./login');
const register = require('./register');
const category = require('./category');
const product = require('./product');

const v1 = express.Router();

v1.use('/login', login);
v1.use('/register', register);
v1.use('/category', auth, category);
v1.use('/product', auth, product);

module.exports = v1;
