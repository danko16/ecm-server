import 'module-alias/register';
import express from 'express';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes.v1);

export default app;
