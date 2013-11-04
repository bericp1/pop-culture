/*exported QuizNewPlayerController */
/*global alert */
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

      if(GameService.isJoined()){
        GameService.join();
      }

      $scope.data = {
        processing: false,
        playerDefaults:{
          name: '',
          points: 0
        },
        player: {},
        saved: false,
        games: GameResource.query(function(){
          $scope.data.gamesLoaded = true;
          if($scope.data.games.length > 0) $scope.data.player.game = $scope.data.games[0]._id;
        }),
        gamesLoaded: false
      };


      $scope.data.player = $scope.data.playerDefaults;

      if(typeof $cookieStore.get('player') === 'string'){
        PlayerResource.get({_id:$cookieStore.get('player')},function(player){
          $scope.data.player = player;
          $scope.data.saved = true;
        }, function(data){
          $cookieStore.remove('player');
          if(data.status !== 404 && typeof data.data.error === 'string'){
            alert(':-/\nSave data corrupt or something:\n' + data.data.error);
          }
        });
      }

      $scope.fn = {};

      $scope.fn.newPlayer = function(){
        $scope.data.processing = true;
        var newPlayer = new PlayerResource();
        for(var prop in $scope.data.player){
          if($scope.data.player.hasOwnProperty(prop)){
            newPlayer[prop] = $scope.data.player[prop];
          }
        }
        newPlayer.$save(function(newPlayer){
          $cookieStore.put('player', newPlayer._id);
          $scope.data.player = $scope.data.playerDefaults;
          $scope.data.processing = false;
          GameService.join($scope.data.player);
        }, function(data){
          if(typeof data.data.invalid === 'object'){
            var str = '';
            $.each(data.data.invalid, function(i,v){
              str = str + '\n' + v.name + ': ' + v.message;
            });
            alert('-_-\nThere\'s something wrong with the data you entered:' + str);
            $scope.data.player = $scope.data.playerDefaults;
            $scope.data.processing = false;
          }else if(typeof data.data.error === 'string'){
            alert(':/\nWhoops:\n' + data.data.error); //TODO Replace
            $scope.data.player = $scope.data.playerDefaults;
            $scope.data.processing = false;
          }else{
            alert('D:\nSomething really bad went wrong! Try again later.'); //TODO Replace
          }
        });
      };

      $scope.fn.deletePlayer = function(id){
        $scope.processing = true;
        var player = new PlayerResource();
        player._id = id;
        player.$delete(function(){
          $scope.data.saved = false;
          $scope.data.player = $scope.data.playerDefaults;
          $cookieStore.remove('player');
          $scope.processing = false;
        }, function(data){
          if(typeof data.data.error === 'string'){
            alert(':/\nCouldn\'t unregister you as a player: ' + data.data.error); //TODO Replace
            $scope.data.processing = false;
          }else{
            alert('D:\nSomething really bad went wrong! Try again later.'); //TODO Replace
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