const express = require('express');
const app = express();

const { logger, logReq, logRes } = require('./libs/logger');
app.use(logReq);

// Security settings
const helmet = require('helmet');
app.use(helmet.frameguard('deny'));
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(helmet.ieNoOpen());

const cors = require('cors');
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// JWT settings
const expressJwt = require('express-jwt');

app.use(
  expressJwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
      `/${process.env.API_VER}/auth`,
      { url: `/${process.env.API_VER}/users`, method: 'POST' },
      {
        url: new RegExp(`^/${process.env.API_VER}/users/inactive/.*`),
        method: 'GET'
      },
      { url: `/${process.env.API_VER}/users/confirm`, method: 'POST' }
    ]
  })
);

app.use(require('./libs/response/res.helper'));

// Endpoints registration
require('./routes')(app);

const db = require('./libs/db/db.service');
try {
  db.connect().then(() => logger.info('db connected!'));
} catch (e) {
  logger.error(e);
}

// Error handler
app.use((err, req, res) => {
  // eslint-disable-line no-unused-vars
  logRes(req, err);

  // Invalid JSON Body Request
  if (err instanceof SyntaxError) {
    return res.status(400).json({ msg: 'syntax_error' });
  }

  if (err.isServer) {
    return res.status(500).json(err.data);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let statusCode = 500;
  if (err.output && err.output.statusCode) {
    statusCode = err.output.statusCode;
  } else if (err.status) {
    statusCode = err.status;
  }

  return res.status(statusCode).json(err.data);
});

module.exports = app;
