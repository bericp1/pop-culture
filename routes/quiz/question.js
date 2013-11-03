var express = require('express'),
  DBActions = require('../../lib/db-actions'),
  utils     = require('../../lib/utils');

var app = module.exports = exports = express();

var QuestionActions = new DBActions('Question');

app.use(utils.adminCheckMiddleware);
app.use(app.router);

//Get all
app.get('/', QuestionActions.getAllHandler(false));

//Get one by ID
app.get('/:id', QuestionActions.getOneHandler(false));

//Add new
app.post('/', QuestionActions.updateHandler(true));

//Delete one/all
app.delete('/:id', QuestionActions.deleteHandler(true));