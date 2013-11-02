/**
 * Created by brandon on 10/26/13.
 */
(function(angular){
  'use strict';
  angular.module('pop-culture', ['compiled-templates', 'ngRoute', 'quizModule', 'presentationModule'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .otherwise({
          redirectTo: '/quiz/new-player'
        });
    }]);
})(angular);