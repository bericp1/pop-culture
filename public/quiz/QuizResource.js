/*global QuizResource */
var QuizResource = (function(){
  return ['$resource', function($resource){
    return $resource('/quiz/:id', {'id':'@_id'});
  }];
})();
