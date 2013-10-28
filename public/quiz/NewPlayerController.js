/*exported NewPlayerController */
var NewPlayerController = (function(){
  'use strict';
  return ['$scope', function($scope){
    $scope.quiz = {
      games: []
    };
    $scope.player = {};
  }];
})();