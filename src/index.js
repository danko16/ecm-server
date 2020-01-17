require('dotenv').config();
require('module-alias/register');
const { createLogger, format, transports } = require('winston');
const config = require('config');
const { sequelize } = require('@models');

const app = require('./app');

const logger = createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()]
});

sequelize.sync({}).then(() => {
  const server = app.listen(config.port);

  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );

  server.on('listening', () =>
    logger.info('server started on http://%s:%d', config.host, config.port)
  );
});
