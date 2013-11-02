/*global QuizGameResource */
var QuizGameResource = (function(){
  return ['$resource', function($resource){
    return $resource(
      '/quiz/game/:_id',
      {'_id':'@_id'},
      {
        'deleteAll': {
          method: 'DELETE',
          isArray: true,
          params: {
            '_id': '*'
          }
        }
      }
    );
  }];
})();
