
const backup = require('mongodb-backup');

backup({
  uri: 'mongodb://localhost:27017/boowlk',
  root: "./",
  collections: ['boowlk']
});
