/*exported QuizQuestionResource */
var QuizQuestionResource = (function(){
  'use strict';
  return ['$resource', function($resource){
    return $resource(
      '/quiz/question/:_id',
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
