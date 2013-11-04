/*exported QuizGameController */
/*global alert */
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
        player: {},
        toCheck: ''
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
        var won = false;
        $.each(GameService.activeAnswers, function(i,v){
          if(v.toLowerCase().trim() === $scope.data.toCheck.toLowerCase().trim()){
            GameService.win();
            won = true;
            return false;
          }else{
            return true;
          }
        });
        if(!won){
          alert('Try Again!');
        }
        $scope.data.toCheck = '';
      };

      $scope.$watch(function(){return GameService.player;}, function(data){
        $scope.data.player = data;
      });

      $scope.$watch(function(){return GameService.activeQuestionNumber;}, function(newNum){
        $scope.data.qNum = newNum;
      }, true);

      $scope.$watch(function(){return GameService.activeQuestionType;}, function(newType){
        $scope.data.qType = newType;
      }, true);

      $scope.$watch(function(){return GameService.state;}, function(newState){
        $scope.data.state = newState;
      });
    }
  ];
})();