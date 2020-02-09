require('module-alias/register');
const express = require('express');
const cors = require('cors');
const config = require('config');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(config.uploads));
app.use('/admin', routes.admin);
app.use('/api/v1', routes.v1);

module.exports = app;
