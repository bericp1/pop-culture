/*exported QuizNewPlayerController */
var QuizNewPlayerController = (function(){
  'use strict';
  return [
    '$scope',
    '$location',
    '$cookieStore',
    'GameResource',
    'PlayerResource',
    'GameService',
    function(
      $scope,
      $location,
      $cookieStore,
      GameResource,
      PlayerResource,
      GameService
      ){

      $scope.data = {
        processing: false,
        playerDefaults:{
          name: '',
          points: 0
        },
        player: {},
        games: GameResource.query(function(){
          $scope.data.gamesLoaded = true;
          if($scope.data.games.length > 0) $scope.data.player.game = $scope.data.games[0]._id;
        }),
        gamesLoaded: false
      };


      $scope.data.player = $scope.data.playerDefaults;

      $scope.fn = {};

      $scope.fn.newPlayer = function(){
        $scope.data.processing = true;
        GameService.join($scope.data.player, function(){}, function(err){
          if(typeof err.data.invalid === 'object'){
            var str = '';
            $.each(err.data.invalid, function(i,v){
              str = str + '\n' + v.name + ': ' + v.message;
            });
            GameService.die('-_-\nThere\'s something wrong with the data you entered:' + str);
            $scope.data.player = $scope.data.playerDefaults;
            $scope.data.processing = false;
          }else if(typeof err.data.error === 'string'){
            GameService.die(':/\nWhoops', err.data.error); //TODO Replace
            $scope.data.player = $scope.data.playerDefaults;
            $scope.data.processing = false;
          }else{
            GameService.die('D:\nSomething really bad went wrong! Try again later.'); //TODO Replace
          }
        });
      };

      $scope.fn.deletePlayer = function(){
        $scope.processing = true;
        GameService.leave(function(err){
          if(typeof err.data.error === 'string'){
            GameService.die('Couldn\'t unregister you as a player', err.data.error);
            $scope.data.processing = false;
          }else{
            GameService.die('D:\nSomething really bad went wrong! Try again later.'); //TODO Replace
          }
        });
      };

      $scope.fn.joinGame = function(){
        GameService.join($scope.data.player);
      };

      $scope.enterCheck = function($event, fn){
        if($event.keyCode === 13 && !$scope.data.processing && $scope.data.games.length > 0) fn();
      };

    }
  ];
})();