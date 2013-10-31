/*exported QuizNewPlayerController */
var QuizNewPlayerController = (function(){
  'use strict';
  return ['$scope', 'QuizResource', function($scope, QuizResource){

    $scope.data = {
      games: [],
      gamesLoaded: false,
      playerName: ''
    };

    $scope.data.games = QuizResource.query(function(){
      $scope.data.gamesLoaded = true;
      var quiz = new QuizResource();
      quiz.name = new Date();
      quiz.$save(function(){
        $scope.data.games.push(quiz);
      });
    });

  }];
})();