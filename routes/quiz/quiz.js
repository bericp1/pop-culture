var express = require('express'),
  DBActions = require('../../lib/db-actions'),
  utils     = require('../../lib/utils');

var app = module.exports = exports = express();

var QuizActions = new DBActions('Quiz');

app.use(utils.adminCheckMiddleware);
app.use(app.router);

//Get all
app.get('/', QuizActions.getAllHandler(false));

//Get one by ID
app.get('/:id', QuizActions.getOneHandler(false));

//Add new
app.post('/', QuizActions.updateHandler(true));

//Delete one/all
app.delete('/:id', QuizActions.deleteHandler(true));