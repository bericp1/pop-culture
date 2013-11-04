/*global QuizNewPlayerController, QuizAdminController, QuizGameController, QuizGameResource, QuizHead, QuizFoot, QuizStatusBox, QuizAdminPasswordBox, QuizQuizResource, QuizQuestionResource, QuizPlayerResource, QuizGameService, QuizQuizController*/
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
  QuizPlayerResource,
  QuizGameService,
  QuizQuizController
  ){
  'use strict';
  angular
    .module('quizModule', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'btford.socket-io'])
    .config(['$routeProvider', 'socketProvider', '$sceProvider', function ($routeProvider, socketProvider, $sceProvider) {
      $routeProvider
        .when('/quiz/new-player',{
          controller: QuizNewPlayerController,
          templateUrl: 'quiz/templates/new-player.tmpl'
        })
        .when('/quiz/game', {
          controller: QuizGameController,
          templateUrl: 'quiz/templates/game.tmpl'
        })
        .when('/quiz/quiz/:name', {
          controller: QuizQuizController,
          templateUrl: 'quiz/templates/quiz.tmpl'
        })
        .when('/quiz/admin', {
          controller: QuizAdminController,
          templateUrl: 'quiz/templates/admin.tmpl'
        });

      socketProvider.prefix('');
      $sceProvider.enabled(false);
    }])
    .run(['socket', function(socket){
      socket.forward('qstart');
      socket.forward('qend');
      socket.forward('qwon');
      socket.forward('qlost');
      socket.forward('iwon');
    }])
    .factory('GameResource',  QuizGameResource)
    .factory('QuizResource',  QuizQuizResource)
    .factory('QuestionResource',  QuizQuestionResource)
    .factory('PlayerResource',  QuizPlayerResource)
    .factory('GameService',  QuizGameService)
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
    QuizPlayerResource,
    QuizGameService,
    QuizQuizController
  );