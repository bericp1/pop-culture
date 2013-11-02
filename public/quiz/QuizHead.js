/*export QuizHead */
var QuizHead = (function(){
  'use strict';
  return function(){
    return {
      restrict: 'AE',
      templateUrl: 'quiz/templates/head.tmpl',
      replace: true
    };
  };
})();