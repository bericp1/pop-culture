/*exported QuizAdminController */
var QuizAdminController = (function(){
  'use strict';
  return ['$scope', 'GameResource', function($scope, GameResource){

    var STATUS_OK = 'OK';
    var STATUS_BAD_PASSWORD = 'Bad admin password';
    var STATUS_NEW_GAME_SUCCESS = 'New game created successfully';
    var STATUS_DEL_GAME_SUCCESS = 'Game deleted successfully';
    var STATUS_DEL_GAMES_SUCCESS = 'All games deleted successfully';
    var STATUS_NEW_GAME_ERROR = 'Failed to create new game';
    var STATUS_DEL_GAME_ERROR = 'Failed to delete game';
    var STATUS_DEL_GAMES_ERROR = 'Failed to delete all games';
    var STATUS_CLASS_OK = 'primary';
    var STATUS_CLASS_SUCCESS = 'success';
    var STATUS_CLASS_ERROR = 'danger';

    $scope.data = {
      adminValid: false,
      status: STATUS_OK,
      statusClass: STATUS_CLASS_OK,
      games: GameResource.query(),
      deleteGame: function(id){
        if(id === '*'){
          GameResource.deleteAll(function(){
            $scope.data.status = STATUS_DEL_GAMES_SUCCESS;
            $scope.data.statusClass = STATUS_CLASS_SUCCESS;
            $scope.$broadcast('games.reload');
          }, function(data){
            $scope.data.status = STATUS_DEL_GAMES_ERROR;
            $scope.data.statusClass = STATUS_CLASS_ERROR;
            if(typeof data.data.error !== 'undefined'){
              $scope.data.status = STATUS_DEL_GAMES_ERROR + ': ' + data.data.error;
            }
          });
        }else{
          var game = new GameResource();
          game._id = id;
          game.$delete(function(){
            $scope.data.status = STATUS_DEL_GAME_SUCCESS;
            $scope.data.statusClass = STATUS_CLASS_SUCCESS;
            $scope.$broadcast('games.reload');
          }, function(data){
            $scope.data.status = STATUS_DEL_GAME_ERROR;
            $scope.data.statusClass = STATUS_CLASS_ERROR;
            if(typeof data.data.error !== 'undefined'){
              $scope.data.status = STATUS_DEL_GAME_ERROR + ': ' + data.data.error;
            }
          });
        }
      },
      newGame: {
        name: '',
        submit: function(){
          var game = new GameResource();
          game.name = $scope.data.newGame.name;
          game.$save(function(){
            $scope.data.status = STATUS_NEW_GAME_SUCCESS;
            $scope.data.statusClass = STATUS_CLASS_SUCCESS;
            $scope.data.newGame.name = '';
            $scope.$broadcast('games.reload');
          }, function(data){
            $scope.data.status = STATUS_NEW_GAME_ERROR;
            $scope.data.statusClass = STATUS_CLASS_ERROR;
            if(typeof data.data.error !== 'undefined'){
              $scope.data.status = STATUS_NEW_GAME_ERROR + ': ' + data.data.error;
            }
          });
        }
      }
    };

    $scope.$on('games.reload', function(){
      $scope.data.games = GameResource.query();
    });

    $scope.$watch('data.adminValid', function(){
      if(!$scope.data.adminValid){
        $scope.data.status = STATUS_BAD_PASSWORD;
        $scope.data.statusClass = STATUS_CLASS_ERROR;
      }else{
        $scope.data.status = STATUS_OK;
        $scope.data.statusClass = STATUS_CLASS_OK;
      }
    }, true);

  }];
})();