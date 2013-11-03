var Schema = require('mongoose').Schema;
module.exports = {
  name: 'Player',
  schema: {
    name:   {
      type: String,
      validate: [function(name){
        return name.trim().toLowerCase() !== '';
      }, 'Name can\'t be empty.']
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game'
    },
    points: Number
  }
};