require('module-alias/register');
const express = require('express');
const { adminAuth } = require('@utils');
const login = require('./login');
const register = require('./register');
const me = require('./me');
const category = require('./category');

const admin = express.Router();

admin.use('/login', login);
admin.use('/register', register);
admin.use('/info', adminAuth, me);
admin.use('/category', adminAuth, category);

module.exports = admin;
