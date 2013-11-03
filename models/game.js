var Schema = require('mongoose').Schema;
module.exports = {
  name: 'Game',
  schema: {
    name: String,
    _created: {
      type: Date,
      'default': Date.now
    },
    quizzes: [{
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      'default': []
    }]
  }
};