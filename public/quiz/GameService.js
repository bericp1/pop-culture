/*exported QuizGameService */
/*global alert */
var QuizGameService = (function(){
  'use strict';
  return ['$location', '$cookieStore', 'GameResource', 'PlayerResource', function($location, $cookieStore, GameResource, PlayerResource){

    var STATE_DEAD = 0;
    var STATE_JOINED = 1;
    var STATE_ACTIVE = 2;

    var GAME_BASE_PATH = '/quiz/game/';
    var HOME_PATH = '/';

    var Me = function(){
      if(typeof $cookieStore.get('player') !== 'undefined'){
        var me = this;
        PlayerResource.get({_id: $cookieStore.get('player')}, function(player){
          me.join(player);
        }, function(err){
          if(err.status === 404){
            $cookieStore.remove('player');
            $location.path(HOME_PATH);
          }else{
            alert('Something very bad went wrong.');
          }
        });
      }
    };

    Me.prototype.player = {};

    Me.prototype.state = STATE_DEAD;

    Me.prototype.join = function(player){
      if(typeof player !== 'undefined'){
        this.player = player;
        this.id = player.game._id || player.game;
        $location.path(GAME_BASE_PATH + this.id);
        this.state = STATE_JOINED;
      }else if(typeof this.player !== 'undefined'){
        $location.path(GAME_BASE_PATH + this.id);
        this.state = STATE_JOINED;
      }
      console.log(player);
    };

    Me.prototype.leave = function(){
      //TODO Move player delete/create logic here.
      $cookieStore.remove('player');
      this.player = {};
      delete this.id;
      this.state = STATE_DEAD;
      $location.path(HOME_PATH);
    };

    Me.prototype.isDead = function(){
      return this.state === STATE_DEAD;
    };

    Me.prototype.isJoined = function(){
      return this.state >= STATE_JOINED;
    };

    Me.prototype.isActive = function(){
      return this.state >= STATE_ACTIVE;
    };

    return new Me();
  }];
})();
