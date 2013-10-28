/*global NewPlayerController*/
(function(angular){
  'use strict';
  angular.module('quizModule', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/quiz/new-player',{
          controller: 'NewPlayerController',
          templateUrl: 'quiz/templates/new-player.tmpl'
        });
    }]);

  /*me.controller('ExampleController', Controller);
  me.service('ExampleModel', Model);
  me.directive('exampleDirective', directive);
  me.factory('exampleService', service);*/
})(angular, NewPlayerController);