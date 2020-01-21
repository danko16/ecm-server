import express from 'express';
import login from './login';
import register from './register';

const v1 = express.Router();

v1.use('/login', login);
v1.use('/register', register);

export default v1;
