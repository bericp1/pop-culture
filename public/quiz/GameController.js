/*exported QuizGameController */
var QuizGameController = (function(){
  'use strict';
  return [
    '$scope',
    'GameService',
    '$location',
    function (
      $scope,
      GameService)
    {

      $scope.const = {
        STATE: {}
      };

      $scope.const.STATE = GameService.STATE;

      $scope.data = {
        state: $scope.const.STATE.WAITING,
        player: {}
      };

      $scope.data.isJoined = GameService.isJoined;
      $scope.data.isLoading = GameService.isLoading;
      $scope.data.isDead = GameService.isDead;
      $scope.data.isActive = GameService.isActive;

      $scope.fn = {};

      $scope.fn.leave = function(){
        GameService.leave();
      };

      $scope.fn.check = function(){
        //TODO Check
      };

      $scope.$watch(function(){return GameService.player;}, function(data){
        $scope.data.player = data;
      });

      $scope.$watch(function(){return GameService.state;}, function(newState){
        $scope.data.state = newState;
      });
    }
  ];
})();