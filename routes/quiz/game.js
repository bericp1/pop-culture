var express = require('express'),
  DBActions = require('../../lib/db-actions');

var app = module.exports = exports = express();

var GameActions = new DBActions('Game');

app.use(function(req, res, next){
  if(typeof req.cookies.adminPassword === 'string' && req.cookies.adminPassword === process.env.PASSWORD){
    req.isAdmin = true;
  }
  next();
});
app.use(app.router);

//Get all
app.get('/', GameActions.getAllHandler(false));

//Get one by ID
app.get('/:id', GameActions.getOneHandler(false));

//Add new
app.post('/', GameActions.updateHandler('name', true));

//Delete one/all
app.delete('/:id', GameActions.deleteHandler(true));