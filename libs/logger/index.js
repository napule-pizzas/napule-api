const winston = require('winston');
const moment = require('moment');
moment.locale('es');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

function logReq(req, res, next) {
  // date ip method url data
  const date = moment().format();
  const ip = req.ip;
  const method = req.method;
  const url = req.originalUrl;

  let message = `${date} | ${ip} | ${method} ${url}`;

  logger.debug(message);

  next();
}

function logRes(req, err) {
  const date = moment().format();
  const ip = req.ip;
  const method = req.method;
  const url = req.originalUrl;

  const error = JSON.stringify(err);

  let message = err.isBoom
    ? `${date} | ${ip} | ${method} ${url} | ${err.output.statusCode} ${error}`
    : `${date} | ${ip} | ${method} ${url} | ${error}`;

  if (err.isBoom && err.isServer) {
    message += ` | STACKTRACE: ${err.stack}`;
  }

  logger.error(message);
}

module.exports = {
  logger,
  logReq,
  logRes
};
