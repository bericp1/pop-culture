var mongoose = require('mongoose'),
  utils = require('./utils.js');

module.exports = function(modelName){
  var Model = mongoose.model(modelName);

  this.getAllHandler = function(adminRequired){
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      return Model.find(utils.handleDBActionInRoute(req, res));
    }
  };

  this.getOneHandler = function(adminRequired){
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      return Model.findById(req.param('id'), utils.handleDBActionInRoute(req, res));
    }
  };

  this.updateHandler = function(requiredFields, adminRequired){
    if(typeof requiredFields === 'string'){
      requiredFields = [requiredFields];
    }
    return function(req, res){
      if(!!adminRequired && !req.isAdmin){
        return utils.handleAccessDenied(req,res);
      }
      var valid = true;
      requiredFields.forEach(function(v){
        if(!req.body.hasOwnProperty(v)){
          valid = false;
        }
      });
      if(!valid){
        res.status(400);
        return res.json({error: 'Bad UPDATE format'});
      }else{
        return Model.findById(req.body.id, utils.handleDBActionInRoute(req, res, function(doc){
          if(doc === null){
            doc = new Model({name: req.body.name});
          }else{
            doc.name = req.body.name;
          }
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
        var docs = Model.find(utils.handleDBActionInRoute(req, res));
        return Model.find().remove(function(err){
          if(err) return utils.handleDBErrorInRoute(res, err);
          else{
            return res.json(docs);
          }
        });
      }else{
        return Model.findById(req.param('id'), utils.handleDBActionInRoute(req, res, function(doc){
          if(doc === null){
            res.status(404);
            return res.json({error: 'Not found'});
          }else{
            return doc.remove(function(err){
              if(err) return utils.handleDBErrorInRoute(res, err);
              else{
                return res.json(doc);
              }
            });
          }
        }));
      }
    }
  };
};