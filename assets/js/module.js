'use strict';

angular.module('blogApp', [
  'ui.router',
  'ngSails',
  'validation.match',
  'blogApp.directives',
  'infinite-scroll'
])
  .run(
  ['$rootScope', '$state', '$stateParams', '$sails', '$timeout',
    function($rootScope, $state, $stateParams, $sails, $timeout){
      var checkAuth = function(toState){
        $timeout(function(){
          $sails.post('/user/is-auth', {}).success(function(data){
            if(data.error){
              $rootScope.$user = null;
              if(!toState){
                $state.go('home');
              }else if(toState.name != 'registration' && toState.name != 'login'){
                $state.go('home');
              }
            }else{
              $rootScope.$user = data;
            }
          });
        }, 0);
      };
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      checkAuth();

      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          checkAuth(toState);
        });
    }]);
