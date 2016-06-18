var app = angular.module('app', [
  'templates',
  'ngMaterial',
  'ngAnimate',
  'ui.tree'
], function($rootScopeProvider) {
  $rootScopeProvider.digestTtl(100);
});
