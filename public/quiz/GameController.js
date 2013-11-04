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
        STATE: {
          LOADING: 'loading',
          WAITING: 'waiting',
          ACTIVE: 'active',
          LOST: 'lost',
          WON: 'won'
        }
      };

      $scope.data = {
        state: $scope.const.STATE.WAITING,
        player: {}
      };

      $scope.fn = {};

      $scope.fn.leave = function(){
        GameService.leave();
      };

      $scope.$watch(function(){return GameService.player;}, function(data){
        $scope.data.player = data;
      });

      $scope.$watch(GameService.isJoined, function(joined){
        if(joined){
          $scope.data.state = $scope.const.STATE.WAITING;
        }else{}
      });
    }
  ];
})();