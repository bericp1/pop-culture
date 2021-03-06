/*exported QuizAdminController */
var QuizAdminController = (function(){
  'use strict';
  return [
    '$scope',
    'GameResource',
    'QuizResource',
    'QuestionResource',
    'PlayerResource',
    'socket',
    function (
      $scope,
      GameResource,
      QuizResource,
      QuestionResource,
      PlayerResource,
      socket)
    {

      var STATUS_CLASS_SUCCESS = 'success';
      var STATUS_CLASS_ERROR = 'danger';

      $scope.data = {
        status: 'Ok',
        statusClass: 'info',
        games: GameResource.query(),
        quizzes: QuizResource.query(),
        questions: QuestionResource.query(),
        players: PlayerResource.query(),
        questionGroups: ['slogan', 'logo', 'commercial'],
        activeQuestionGroup: 'slogan',
        deleteThing: function(thing, ThingResource, id){
          if(id === '*'){
            ThingResource.deleteAll(function(){
              $scope.data.status = 'Deleted all ' + thing + 's successfully';
              $scope.data.statusClass = STATUS_CLASS_SUCCESS;
              $scope.$broadcast(thing + '.reload');
            }, function(data){
              $scope.data.status = 'Failed to delete all ' + thing + 's';
              $scope.data.statusClass = STATUS_CLASS_ERROR;
              if(typeof data.data.error !== 'undefined'){
                $scope.data.status = $scope.data.status + ': ' + data.data.error;
              }
            });
          }else{
            var model = new ThingResource();
            model._id = id;
            model.$delete(function(){
              $scope.data.status = 'Deleted ' + thing + ' successfully';
              $scope.data.statusClass = STATUS_CLASS_SUCCESS;
              $scope.$broadcast(thing + '.reload');
            }, function(data){
              $scope.data.status = 'Failed to delete ' + thing;
              $scope.data.statusClass = STATUS_CLASS_ERROR;
              if(typeof data.data.error !== 'undefined'){
                $scope.data.status = $scope.data.status + ': ' + data.data.error;
              }
            });
          }
        },
        newThing: function(thing, ThingResource){
          var model = new ThingResource();
          for(var prop in $scope.data.new[thing]){
            if($scope.data.new[thing].hasOwnProperty(prop) && typeof $scope.data.new[thing][prop] !== 'function'){
              model[prop] = $scope.data.new[thing][prop];
            }
          }
          model.$save(function(){
            $scope.data.status = 'New ' + thing + ' created successfully';
            $scope.data.statusClass = STATUS_CLASS_SUCCESS;
            $scope.data.new[thing] = $scope.data.defaults[thing];
            $scope.$broadcast(thing + '.reload');
          }, function(data){
            $scope.data.status = 'Failed to create new ' + thing;
            $scope.data.statusClass = STATUS_CLASS_ERROR;
            if(typeof data.data.error !== 'undefined'){
              $scope.data.status = $scope.data.status + ':<br>' + data.data.error;
            }
          });
        },
        funcs: {
          game: {
            'new': function(){
              $scope.data.newThing('game', GameResource);
            },
            'delete': function(id){
              $scope.data.deleteThing('game', GameResource, id);
            }
          },
          quiz: {
            'new': function(){
              $scope.data.newThing('quiz', QuizResource);
            },
            'delete': function(id){
              $scope.data.deleteThing('quiz', QuizResource, id);
            }
          },
          question: {
            'new': function(){
              $scope.data.newThing('question', QuestionResource);
            },
            'delete': function(id){
              $scope.data.deleteThing('question', QuestionResource, id);
            }
          },
          player: {
            'new': function(){
              $scope.data.newThing('player', PlayerResource);
            },
            'delete': function(id){
              $scope.data.deleteThing('player', PlayerResource, id);
            }
          },
          sendEvent: function(ev){
            if(ev){
              socket.emit(ev);
            }
          }
        },
        'new':{},
        defaults:{
          game: {},
          quiz: {},
          question: {
            type: 'slogan',
            worth: 0
          },
          player: {
            points: 0
          }
        }
      };

      $scope.data['new'] = $scope.data.defaults;

      $scope.enterCheck = function($event, fn){
        if($event.keyCode === 13) fn();
      };

      $scope.$on('game.reload', function(){
        $scope.data.games = GameResource.query();
      });

      $scope.$on('quiz.reload', function(){
        $scope.data.quizzes = QuizResource.query();
      });

      $scope.$on('question.reload', function(){
        $scope.data.questions = QuestionResource.query();
      });

      $scope.$watch('data.new.question.answerUnprocessed', function(){
        if(typeof $scope.data.new.question.answerUnprocessed === 'string')
          $scope.data.new.question.answers = $scope.data.new.question.answerUnprocessed.split('|');
      }, true);

      $scope.$on('player.reload', function(){
        $scope.data.players = PlayerResource.query();
      });

    }
  ];
})();