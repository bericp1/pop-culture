/*global QuizNewPlayerController, QuizResource*/
(function(angular, QuizNewPlayerController, QuizResource){
  'use strict';
  angular
    .module('quizModule', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/quiz/new-player',{
          controller: 'QuizNewPlayerController',
          templateUrl: 'quiz/templates/new-player.tmpl'
        });
    }])
    .factory('QuizResource', QuizResource);

  /*me.controller('ExampleController', Controller);
  me.service('ExampleModel', Model);
  me.directive('exampleDirective', directive);
  me.factory('exampleService', service);*/
})(angular, QuizNewPlayerController, QuizResource);