var express = require('express'),
  DBActions = require('../../lib/db-actions');

var app = module.exports = exports = express();

var QuizActions = new DBActions('Quiz');

//Get all
app.get('/', QuizActions.getAllHandler);

//Get one by ID
app.get('/:id', QuizActions.getOneHandler);

//Add new
app.post('/', QuizActions.updateHandler('name'));

//Delete one/all
app.delete('/:id', QuizActions.deleteHandler);