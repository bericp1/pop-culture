var mongoose = require('mongoose');

var Quiz = mongoose.Schema({
  name: String
});

module.exports = {
  name: 'Quiz',
  schema: Quiz
};