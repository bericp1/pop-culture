var mongoose = require('mongoose');

var utils = exports;

utils.handleDBAction = function(nullCallback, nonNullCallback, errCallback){
  return function(err, data){
    if(err && typeof errCallback === 'function') return errCallback(err);
    else if(err) return null;
    else if(data === null && typeof nullCallback === 'function') return nullCallback();
    else if(typeof nonNullCallback === 'function') return nonNullCallback(data);
    else return null;
  };
};

utils.autoPopulate = function(data, Model, callback){
  var allPaths = Model.schema.paths;
  var popPaths = [];
  for(var path in allPaths){
    if(
      allPaths.hasOwnProperty(path) &&
        (allPaths[path].hasOwnProperty('caster') || allPaths[path].options.hasOwnProperty('ref'))){
      popPaths.push(path);
    }
  }
  if(popPaths.length > 0){
    Model.populate(data, popPaths.join(' '), function(err, newData){
      if(err){callback(data);}
      else{
        callback(newData);
      }
    });
  }else{
    callback(data);
  }
};

utils.findByIdAutoPopulate = function(id, Model, callback){
  Model.findById(id, utils.handleDBAction(
    function(){
      return callback(undefined, null);
    },
    function(data){
      return utils.autoPopulate(data, Model, function(newData){
        return callback(undefined, newData);
      });
    },
    function(err){
      return callback(err);
    }
  ));
};

utils.findAutoPopulate = function(Model, callback){
  Model.find(utils.handleDBAction(
    function(){
      return callback(undefined, null);
    },
    function(data){
      var newCollection = [];
      data.forEach(function(singleData){
        utils.autoPopulate(singleData, Model, function(newData){
          newCollection.push(newData);
          if(newCollection.length === data.length){
            callback(undefined, newCollection);
          }
        });
      });
    },
    function(err){
      return callback(err);
    }
  ));
};

utils.handleDBActionInRoute = function(req, res, nullCallback, nonNullCallback){
  return utils.handleDBAction(
    nullCallback || function(){utils.handleNotFound(req, res)},
    nonNullCallback || function(data){return res.json(data);},
    function(err){return utils.handleDBErrorInRoute(res, err);}
  );
};

utils.adminCheckMiddleware = function(req, res, next){
  req.isAdmin = typeof req.cookies.adminPassword === 'string' && req.cookies.adminPassword === process.env.PASSWORD;
  next();
};


utils.handleDBErrorInRoute = function(res, err){
  res.status(500);
  var ret = {};
  if(err.name === 'ValidationError'){
    var invalid = [];
    for(var field in err.errors){
      if(err.errors.hasOwnProperty(field)){
        invalid.push({
          name: field,
          message: err.errors[field].type
        })
      }
    }
    ret.error = 'Invalid fields';
    ret.invalid = invalid;
  }else{
    ret.error = 'DB Error: ' + err.message;
  }
  return res.json(ret);
};

utils.handleNotFound = function(req, res){
  res.status(404);
  return res.json({error: 'Document not found'});
};

utils.handleAccessDenied = function(req, res){
  res.status(403);
  return res.json({error: 'Access denied'});
};

utils.handleMissingFields = function(req, res, missingFields){
  res.status(400);
  var ret = {err:'Missing required fields'};
  if(typeof missingFields !== 'undefined'){
    ret.err = ret.err + ': ' + missingFields;
    ret.missing = missingFields;
  }
  return res.json(ret);
};