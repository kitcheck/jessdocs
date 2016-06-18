var app = angular.module('app', [
  'templates',
  'ngMaterial',
  'ngAnimate',
  'ui.tree'
], function($rootScopeProvider) {
  $rootScopeProvider.digestTtl(100);
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('cyan', {
      'default': '500'
    });
});