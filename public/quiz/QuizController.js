/*exported QuizQuizController */
var QuizQuizController = (function(){
  'use strict';
  return [
    '$scope',
    '$window',
    '$routeParams',
    'QuizResource',
    'socket',
    function(
      $scope,
      $window,
      $routeParams,
      QuizResource,
      socket
      ){

      $scope.data = {
        players: [],
        quiz: {},
        questions: [],
        activeQuestionIndex: -1,
        ready: false,
        activeContent: '<h2>Loading...</h2>'
      };

      QuizResource.query(function(quizzes){
        $.each(quizzes, function(i,v){
          if(v.name === $routeParams.name){
            $scope.data.quiz = v;
            $scope.data.questions = $scope.data.quiz.questions;
          }
        });
      });

      $scope.fn = {};

      var winListener = function(player){
        socket.removeListener('iwon', winListener);
        socket.emit('qlost', player);
        socket.emit('qwon', player);
        $scope.$apply(function(){
          $scope.data.winner = player;
        });
      };

      var newQuestion = function(opFunc){
        socket.emit('qend', {});
        delete $scope.data.winner;
        var tmp = $scope.data.activeQuestionIndex;
        if(opFunc(tmp) < 0 || opFunc(tmp) > 2){
          $scope.data.activeQuestionIndex = -1;
        }else{
          $scope.data.activeQuestionIndex = -1;
          $scope.data.ready = true;
          socket.emit('qstart', {
            'answers': $scope.data.questions[opFunc(tmp)].answers,
            'number': opFunc(tmp)+1,
            'type': $scope.data.quiz.name
          });
          socket.addListener('iwon', winListener);
          $window.setTimeout(function(){
            $scope.$apply(function(){
              if($scope.data.ready){
                $scope.data.activeQuestionIndex = opFunc(tmp);
                $scope.data.ready = false;
              }
            });
          }, 3000);
        }
      };

      $scope.fn.prev = function(){
        newQuestion(function(tmp){return tmp-1;});
      };
      $scope.fn.next = function(){
        newQuestion(function(tmp){return tmp+1;});
      };

      $window.addEventListener('message', function(msg){
        if(msg.data === 'slide:start'){
          //socket.emit('qstart', {'as':$scope.data.questions.answers});
          $scope.$apply(function(){
            $scope.data.activeQuestionIndex = -1;
            $scope.data.ready = false;
            $scope.fn.next();
          });
        }else if(msg.data === 'slide:stop'){
          $scope.$apply(function(){
            $scope.data.activeQuestionIndex = -1;
            $scope.data.ready = false;
            socket.emit('qend');
          });
        }
      }, false);

    }
  ];
})();