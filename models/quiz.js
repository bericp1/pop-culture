var Schema = require('mongoose').Schema;
module.exports = {
  name: 'Quiz',
  schema: {
    name: String,
    questions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
      'default': []
    }]
  }
};