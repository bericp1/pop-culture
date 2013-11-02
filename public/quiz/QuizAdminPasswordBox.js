/*export QuizAdminPasswordBox */
var QuizAdminPasswordBox = (function(){
  'use strict';
  return function(){
    return {
      restrict: 'AE',
      templateUrl: 'quiz/templates/admin-password-box.tmpl',
      scope: {
        valid: '=adminPasswordBox',
        onChange: '=passwordOnChange'
      },
      link: function(scope, $elem, attrs){
        scope.actualPassword = '4ostddu1';
        $elem.on('keyup', 'input', function(){
          if(scope.enteredPassword === scope.actualPassword && !scope.valid){
            scope.valid = true;
            if(typeof scope.onChange === 'function'){onChange(scope.valid);}
            scope.$apply();
          }else if(scope.enteredPassword !== scope.actualPassword && scope.valid){
            scope.valid = false;
            if(typeof scope.onChange === 'function'){onChange(scope.valid);}
            scope.$apply();
          }
        });
      }
    };
  };
})();