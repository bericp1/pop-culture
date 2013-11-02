var express = require('express'),
  mongoose = require('mongoose'),
  utils = require('../../lib/utils');

var app = module.exports = exports = express();

var Game = mongoose.model('Game');

//Get all
app.get('/', function(req, res){
  return Game.find(utils.handleDBActionInRoute(req, res));
});

//Get one by ID
app.get('/:id', function(req, res){
  return Game.findById(req.param('id'), utils.handleDBActionInRoute(req, res));
});

//Add new
app.post('/', function(req, res){
  if(!req.body.hasOwnProperty('name')){
    res.status(400);
    return res.json({error: 'Bad UPDATE format'});
  }else{
    return Game.findById(req.body.id, utils.handleDBActionInRoute(req, res, function(game){
      if(game === null){
        game = new Game({name: req.body.name});
      }else{
        game.name = req.body.name;
      }
      return game.save(utils.handleDBActionInRoute(req, res));
    }));
  }
});

app.delete('/:id', function(req, res){
  if(req.param('id') === '*'){
    var games = Game.find(utils.handleDBActionInRoute(req, res));
    return Game.find().remove(function(err){
      if(err) return utils.handleDBErrorInRoute(res, err);
      else{
        return res.json(games);
      }
    });
  }else{
    return Game.findById(req.param('id'), utils.handleDBActionInRoute(req, res, function(game){
      if(game === null){
        res.status(404);
        return res.json({error: 'Game not found'});
      }else{
        return game.remove(function(err){
          if(err) return utils.handleDBErrorInRoute(res, err);
          else{
            return res.json(game);
          }
        });
      }
    }));
  }
  /*if(!req.body.hasOwnProperty('_id')){
    res.status(400);
    return res.json({error: 'Bad UPDATE format'});
  }else{
    return Game.findById(req.body.id, utils.handleDBActionInRoute(req, res, function(game){
      if(game === null){
        game = new Game({name: req.body.name});
      }else{
        game.name = req.body.name;
      }
      return game.save(utils.handleDBActionInRoute(req, res));
    }));
  }*/
});