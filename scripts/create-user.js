const config = require('../config/default');

const User = require('../components/user/user.model');

const userData = require('./data/user');

const DEBUG = true;
function log(...args) {
  DEBUG && console.log(...args);
}

async function run() {
  try {
    await connectDb(config);
    console.log('-- INFO: db connected!');
    await createUser(userData);
  } catch (e) {
    console.log('-- ERROR: ', e);
  }
  process.exit();
}

async function createUser(uData) {
  log('Creating user ... ');
  const user = new User(uData);
  return user.save();
}

async function connectDb(cfg) {
  const dbCfg = cfg.db;
  const { connString, dbName } = dbCfg;
  const { autoIndex, bufferCommands, useNewUrlParser } = dbCfg.options;

  const mongoose = require('mongoose');
  return mongoose.connect(connString, {
    dbName,
    autoIndex,
    bufferCommands,
    useNewUrlParser
  });
}

run();
