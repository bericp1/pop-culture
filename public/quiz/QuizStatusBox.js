/*export QuizStatusBox */
var QuizStatusBox = (function(){
  'use strict';
  return function(){
    return {
      restrict: 'AE',
      templateUrl: 'quiz/templates/status-box.tmpl',
      scope: {
        status: '=statusBox',
        statusClass: '=statusClass'
      }
    };
  };
})();