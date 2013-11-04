/*exported QuizGameService */
/*global alert */
var QuizGameService = (function(){
  'use strict';
  return [
    '$location',
    '$cookieStore',
    '$rootScope',
    'GameResource',
    'PlayerResource',
    'QuizResource',
    'socket',
    function(
      $location,
      $cookieStore,
      $rootScope,
      GameResource,
      PlayerResource,
      QuizResource,
      socket
      ){

      var STATE = {
        DEAD: 0,
        LOADING: 1,
        JOINED: 2,
        WAITING: 2,
        WON: 2.1,
        LOST: 2.2,
        ACTIVE: 3
      };

      var GAME_BASE_PATH = '/quiz/game';
      var HOME_PATH = '/';

      var Me = function(){
        var me = this;
        if(typeof $cookieStore.get('player') !== 'undefined'){
          me.join($cookieStore.get('player'), function(){}, function(err){
            if(err.status === 404){
              $cookieStore.remove('player');
              $location.path(HOME_PATH);
            }else{
              me.die('Could not delete you...', err);
            }
          });
        }
        /*$rootScope.$on('$routeChangeSuccess', function(event, newRoute){
          if(me.isJoined() &&
            typeof newRoute.$$route !== 'undefined' &&
            newRoute.$$route.originalPath !== GAME_BASE_PATH &&
            newRoute.$$route.originalPath.indexOf('admin') === -1){
            event.preventDefault();
            $location.path(GAME_BASE_PATH);
          }
        });*/
        $rootScope.$on('qstart', function(event, msg){
          console.log(msg);
          me.activeAnswers = msg.answers;
          me.activeQuestionNumber = msg.number;
          me.activeQuestionType = msg.type;
          me.state = STATE.ACTIVE;
        });
        $rootScope.$on('qlost', function(event, msg){
          if(me.player._id !== msg._id){
            me.state = STATE.LOST;
          }
        });
        $rootScope.$on('qwon', function(event, msg){
          if(me.player._id === msg._id){
            me.state = STATE.WON;
          }
        });
        $rootScope.$on('qend', function(){
          delete me.activeAnswers;
          delete me.activeQuestionNumber;
          delete me.activeQuestionType;
          me.state = STATE.WAITING;
        });
      };

      Me.prototype.win = function(){
        socket.emit('iwon', this.player);
      };

      Me.prototype.player = {};

      Me.prototype.game = {};

      Me.prototype.state = STATE.DEAD;

      Me.prototype.die = function(prefix, err){
        if(typeof err === 'undefined'){
          err = prefix;
          prefix = '';
        }
        if(typeof err === 'string'){
          alert(err);
        }else if(typeof err.data.error === 'string'){
          alert('Uh-Oh!\n' + prefix + ':\n' + err.data.error);
        }else{
          alert('Something very bad went wrong! Sorry');
        }
        this.state = STATE.DEAD;
      };

      Me.prototype.loadGame = function(successCallback, errorCallback){
        var me = this;
        errorCallback = errorCallback || me.die;
        me.game = GameResource.get({_id: this.id}, function(){
          me.quizzes = me.game.quizzes;
          var tmp = [];
          $.each(me.quizzes, function(i,quiz){
            QuizResource.get({_id:quiz._id},function(newQuiz){
              tmp.push(newQuiz);
              if(tmp.length === me.quizzes.length){
                me.quizzes = tmp;
                me.state = STATE.JOINED;
                successCallback(me.quizzes);
              }
            }, errorCallback);
          });
        }, function(err){
          if(err.status === 404){
            me.die('Game for this user does not exist.');
          }else{
            errorCallback(err);
          }
        });
      };

      Me.prototype.setPlayer = function(player, callback){
        this.player = player;
        this.id = player.game._id || player.game;
        $cookieStore.put('player', player._id);
        $location.path(GAME_BASE_PATH);
        this.state = STATE.LOADING;
        this.loadGame(callback);
      };

      Me.prototype.join = function(player, successCallback, errorCallback){
        var me = this;
        successCallback = successCallback || function(){};
        errorCallback = errorCallback || me.die;
        if(typeof player !== 'undefined'){
          if(typeof player === 'string'){ //CHECK
            PlayerResource.get({_id: player}, function(player){
              me.setPlayer(player, successCallback);
            }, errorCallback);
          }else if(typeof player === 'object'){ //Create user it doesn't exist
            if(player.hasOwnProperty('_id')){
              me.setPlayer(player, successCallback);
            }else{
              var newPlayer = new PlayerResource(player);
              newPlayer.$save(function(){
                me.setPlayer(newPlayer, successCallback);
              }, errorCallback);
            }
          }
        }else if(typeof this.player !== 'undefined' && this.player.hasOwnProperty('_id')){
          me.setPlayer(this.player, successCallback);
        }
      };

      Me.prototype.leave = function(errorCallback){
        var me = this;
        errorCallback = errorCallback || me.die;
        var playerToDelete = new PlayerResource();
        playerToDelete._id = this.player._id;
        playerToDelete.$delete(function(){
          $cookieStore.remove('player');
          me.player = {};
          delete me.id;
          me.state = STATE.DEAD;
          $location.path(HOME_PATH);
        }, errorCallback);
      };

      Me.prototype.gainPoint = function(sCB, eCB){
        sCB = sCB || function(){};
        eCB = eCB || function(){};
        Me.player.points++;
        Me.player.$save(sCB, eCB);
      };

      Me.prototype.isDead = function(){
        return Math.floor(this.state) === STATE.DEAD;
      };

      Me.prototype.isLoading = function(){
        return Math.floor(this.state) >= STATE.LOADING;
      };

      Me.prototype.isJoined = function(){
        return Math.floor(this.state) >= STATE.JOINED;
      };

      Me.prototype.isActive = function(){
        return Math.floor(this.state) >= STATE.ACTIVE;
      };

      Me.prototype.STATE = STATE;

      return new Me();
    }
  ];
})();
