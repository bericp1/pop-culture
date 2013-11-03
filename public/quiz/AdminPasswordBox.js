/*exported QuizAdminPasswordBox */
var QuizAdminPasswordBox = (function(){
  'use strict';
  return ['$cookies', function($cookies){
    return {
      restrict: 'AE',
      templateUrl: 'quiz/templates/admin-password-box.tmpl',
      scope: {},
      link: function(scope){
        scope.password = $cookies.adminPassword || '';
        scope.$watch('password', function(){
          $cookies.adminPassword = scope.password;
        }, true);
      }
    };
  }];
})();