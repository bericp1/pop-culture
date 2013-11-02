/*global QuizNewPlayerController, QuizGameResource, QuizHead, QuizFoot, QuizStatusBox, QuizAdminPasswordBox*/
(function(angular, QuizNewPlayerController, QuizGameResource, QuizHead, QuizFoot, QuizStatusBox, QuizAdminPasswordBox){
  'use strict';
  angular
    .module('quizModule', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/quiz/new-player',{
          controller: 'QuizNewPlayerController',
          templateUrl: 'quiz/templates/new-player.tmpl'
        })
        .when('/quiz/admin', {
          controller: 'QuizAdminController',
          templateUrl: 'quiz/templates/admin.tmpl'
        });
    }])
    .factory('GameResource',  QuizGameResource)
    .directive('head',        QuizHead)
    .directive('foot',        QuizFoot)
    .directive('statusBox',  QuizStatusBox)
    .directive('adminPasswordBox',  QuizAdminPasswordBox);

  /*me.controller('ExampleController', Controller);
  me.service('ExampleModel', Model);
  me.directive('exampleDirective', directive);
  me.factory('exampleService', service);*/
})(angular, QuizNewPlayerController, QuizGameResource, QuizHead, QuizFoot, QuizStatusBox, QuizAdminPasswordBox);