/*exported QuizNewPlayerController */
var QuizNewPlayerController = (function(){
  'use strict';
  return ['$scope', 'GameResource', function($scope, GameResource){

    $scope.data = {
      games: [],
      gamesLoaded: false,
      playerName: ''
    };

    $scope.data.games = GameResource.query(function(){
      $scope.data.gamesLoaded = true;
    });

  }];
})();