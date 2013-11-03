var utils = {};

utils.handleDBErrorInRoute = function(res, err){
  res.status(500);
  return res.json({error: 'DB error: ' + err});
};

utils.handleDBActionInRoute = function(req, res, nullCallback, nonNullCallback){
  return function(err, data){
    if(err) return utils.handleDBErrorInRoute(res, err);
    if(data === null){
      if(typeof nullCallback === 'function') return nullCallback();
      else{
        res.status(404);
        return res.json({error: 'Document(s) not found'});
      }
    }else{
      if(typeof nonNullCallback === 'function') return nonNullCallback(data);
      else{
        return res.json(data);
      }
    }
  }
};

utils.adminCheckMiddleware = function(req, res, next){
  req.isAdmin = typeof req.cookies.adminPassword === 'string' && req.cookies.adminPassword === process.env.PASSWORD;
  next();
};

utils.handleAccessDenied = function(req, res){
  res.status(403);
  return res.json({error: 'Access denied'});
};

module.exports = exports = utils;