var app = angular.module('app', [
  'templates',
  'ngMaterial',
  'ngAnimate',
  'ui.tree',
  'color.picker'
], function($rootScopeProvider) {
  $rootScopeProvider.digestTtl(100);
});

app.config(function($mdThemingProvider, $animateProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('cyan', {
      'default': '500'
    });
    $animateProvider.classNameFilter(/angular-animate/);
});

app.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
});