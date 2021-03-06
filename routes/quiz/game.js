var express = require('express'),
  DBActions = require('../../lib/db-actions'),
  utils     = require('../../lib/utils');

var app = module.exports = exports = express();

var GameActions = new DBActions('Game');

app.use(utils.adminCheckMiddleware);
app.use(app.router);

//Get all
app.get('/', GameActions.getAllHandler(false));

//Get one by ID
app.get('/:id', GameActions.getOneHandler(false));

//Add new
app.post('/', GameActions.updateHandler(true));

//Delete one/all
app.delete('/:id', GameActions.deleteHandler(true));