var mongoose = require('mongoose'),
  utils = require('./utils'),
  xtend = require('xtend');

module.exports = function(modelName){
  var Model = mongoose.model(modelName);

  this.getAllHandler = function(adminRequired){
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      return utils.findAutoPopulate(Model, utils.handleDBActionInRoute(req, res));
    }
  };

  this.getOneHandler = function(adminRequired){
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      return utils.findByIdAutoPopulate(req.param('id'), Model, utils.handleDBActionInRoute(req, res));
    }
  };

  this.updateHandler = function(adminRequired){
    var schemaPaths = [];
    var requiredSchemaPaths = [];
    for(var path in Model.schema.paths){
      if(Model.schema.paths.hasOwnProperty(path)){
        schemaPaths.push(path);
        if(path.indexOf('_') !== 0){
          requiredSchemaPaths.push(path);
        }
      }
    }
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      var missingPaths = [];
      var mappedPaths = {};
      schemaPaths.forEach(function(path){
        if(req.body.hasOwnProperty(path)){
          mappedPaths[path] = req.body[path];
        }else if(requiredSchemaPaths.indexOf(path) > -1){
          missingPaths.push(path);
        }
      });
      if(missingPaths.length > 0){
        return utils.handleMissingFields(req, res, missingPaths);
      }else{
        return Model.findById(req.body.id, utils.handleDBActionInRoute(req, res, function(){
          var doc = new Model(mappedPaths);
          return doc.save(utils.handleDBActionInRoute(req, res))
        },function(doc){
          doc = xtend(doc, mappedPaths);
          return doc.save(utils.handleDBActionInRoute(req, res));
        }));
      }
    };
  };

  this.deleteHandler = function(adminRequired){
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      if(req.param('id') === '*'){
        return Model.find().remove(utils.handleDBActionInRoute(req, res, function(){}, function(){
          res.json([]);
        }));
      }else{
        return Model.findById(req.param('id'), utils.handleDBActionInRoute(req, res, undefined, function(doc){
          return doc.remove(function(doc){
            return res.json(doc);
          });
        }));
      }
    }
  };
};