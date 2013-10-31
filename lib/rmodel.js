var fs = require('fs'),
  path = require('path');

var rmodel = function (dir) {
  var models = [];
  fs.readdirSync(dir)
    .forEach(function(rel){
      var abs = path.join(dir, rel);
      var stats = fs.statSync(abs);
      if(!stats.isDirectory() && rel.indexOf('.js') === (rel.length - 3)){
        models.push(rel.substr(0,rel.length-3));
      }
    });
  return models;
};

module.exports = rmodel;