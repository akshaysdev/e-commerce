const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.Promise = global.Promise;

/* Creating a connection to the MongoDB database. */
const mongoDb = mongoose.createConnection(process.env.MONGODB_URI, mongooseOptions, (err) => {
  if (!err) {
    console.log('Connected to MongoDB...');
  }
});

module.exports = { mongoDb };
