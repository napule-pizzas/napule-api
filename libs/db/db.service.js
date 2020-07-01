const mongoose = require('mongoose');

mongoose.set('debug', true);

async function connect(cfg) {
  const dbCfg = cfg.get('db');
  const { connString, dbName } = dbCfg;
  const options = dbCfg.options;
  await mongoose.connect(`${connString}/${dbName}`, options);
}

module.exports = {
  connect,
  types: mongoose.Types
};
