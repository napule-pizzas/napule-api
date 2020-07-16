const mongoose = require('mongoose');

mongoose.set('debug', true);

async function connect() {
  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 5,
    keepAlive: 100,
    connectTimeoutMS: 5000,
    bufferCommands: false,
    useFindAndModify: false,
    useCreateIndex: true
  };
  await mongoose.connect(`${process.env.MONGODB_URI}`, options);
}

module.exports = {
  connect,
  types: mongoose.Types
};
