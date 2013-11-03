var express = require('express'),
  DBActions = require('../../lib/db-actions'),
  utils     = require('../../lib/utils');

var app = module.exports = exports = express();

var PlayerActions = new DBActions('Player');

app.use(utils.adminCheckMiddleware);
app.use(app.router);

//Get all
app.get('/', PlayerActions.getAllHandler(false));

//Get one by ID
app.get('/:id', PlayerActions.getOneHandler(false));

//Add new
app.post('/', PlayerActions.updateHandler(false));

//Delete one/all
app.delete('/:id', PlayerActions.deleteHandler(false));