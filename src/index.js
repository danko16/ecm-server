import 'module-alias/register';
import { createLogger, format, transports } from 'winston';
import config from 'config';
import { sequelize } from '@models';
import { config as dotenv } from 'dotenv';
dotenv();

import app from './app';

const logger = createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()]
});

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise %s %s', p, reason);
});

sequelize.sync({}).then(() => {
  const server = app.listen(config.port);

  server.on('listening', () =>
    logger.info('server started on http://%s:%d', config.host, config.port)
  );
});
