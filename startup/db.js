const mongoose = require('mongoose');
const config = require('config');
module.exports = function() {
  const db = config.get('db');
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(db)
    .then(() => console.log(`Connected to ${db}...`));
}