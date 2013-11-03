/*global QuizNewPlayerController, QuizAdminController, QuizGameController, QuizGameResource, QuizHead, QuizFoot, QuizStatusBox, QuizAdminPasswordBox, QuizQuizResource, QuizQuestionResource, QuizPlayerResource*/
(function(
  angular,
  QuizNewPlayerController,
  QuizAdminController,
  QuizGameController,
  QuizGameResource,
  QuizHead,
  QuizFoot,
  QuizStatusBox,
  QuizAdminPasswordBox,
  QuizQuizResource,
  QuizQuestionResource,
  QuizPlayerResource
  ){
  'use strict';
  angular
    .module('quizModule', ['ngRoute', 'ngResource', 'ngCookies'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/quiz/new-player',{
          controller: QuizNewPlayerController,
          templateUrl: 'quiz/templates/new-player.tmpl'
        })
        .when('/quiz/game/:id', {
          controller: QuizGameController,
          templateUrl: 'quiz/templates/game.tmpl'
        })
        .when('/quiz/admin', {
          controller: QuizAdminController,
          templateUrl: 'quiz/templates/admin.tmpl'
        });
    }])
    .factory('GameResource',  QuizGameResource)
    .factory('QuizResource',  QuizQuizResource)
    .factory('QuestionResource',  QuizQuestionResource)
    .factory('PlayerResource',  QuizPlayerResource)
    .directive('head',        QuizHead)
    .directive('foot',        QuizFoot)
    .directive('statusBox',  QuizStatusBox)
    .directive('adminPasswordBox',  QuizAdminPasswordBox);

  /*me.controller('ExampleController', Controller);
   me.service('ExampleModel', Model);
   me.directive('exampleDirective', directive);
   me.factory('exampleService', service);*/
})(
    angular,
    QuizNewPlayerController,
    QuizAdminController,
    QuizGameController,
    QuizGameResource,
    QuizHead,
    QuizFoot,
    QuizStatusBox,
    QuizAdminPasswordBox,
    QuizQuizResource,
    QuizQuestionResource,
    QuizPlayerResource
  );