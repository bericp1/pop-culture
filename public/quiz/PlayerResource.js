/*exported QuizPlayerResource */
var QuizPlayerResource = (function(){
  'use strict';
  return ['$resource', function($resource){
    return $resource(
      '/quiz/player/:_id',
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
