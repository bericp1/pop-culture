var utils = {};

utils.handleDBErrorInRoute = function(res, err){
  res.status(500);
  return res.json({error: 'DB error: ' + err});
};

utils.handleDBActionInRoute = function(req, res, callback){
  return function(err, data){
    if(err) return utils.handleDBErrorInRoute(res, err);
    if(typeof callback !== 'function'){
      if(data == null){
        res.status(404);
        data = {error: 'No such DB Document'};
      }
      return res.json(data);
    }else{
      return callback(data);
    }
  }
};

module.exports = exports = utils;