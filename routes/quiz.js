var express = require('express'),
  mongoose = require('mongoose'),
  utils = require('../lib/utils');

var app = module.exports = exports = express();

var Quiz = mongoose.model('Quiz');

//Get all
app.get('/', function(req, res){
  return Quiz.find(utils.handleDBActionInRoute(req, res));
});

//Get one by ID
app.get('/:id', function(req, res){
  return Quiz.findById(req.param('id'), utils.handleDBActionInRoute(req, res));
});

//Add new
app.post('/', function(req, res){
  if(!req.body.hasOwnProperty('name')){
    res.status(400);
    return res.json({error: 'Bad UPDATE format'});
  }else{
    return Quiz.findById(req.body.id, utils.handleDBActionInRoute(req, res, function(quiz){
      if(quiz === null){
        quiz = new Quiz({name: req.body.name});
      }else{
        quiz.name = req.body.name;
      }
      return quiz.save(utils.handleDBActionInRoute(req, res));
    }));
  }
});