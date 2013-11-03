/*exported QuizQuizResource */
var QuizQuizResource = (function(){
  'use strict';
  return ['$resource', function($resource){
    return $resource(
      '/quiz/quiz/:_id',
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
