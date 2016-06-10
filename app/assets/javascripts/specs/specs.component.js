var module = angular.module('specs', 
    ['templates', 
     'ui.tree',
     'ngAnimate']);
module.component('itemRow', {
     bindings: {
       spec: '<',
       uiTreeCallbacks: '='
     },
     templateUrl: 'specs/spec.template.html',
     controller: function($scope) {
       var self = this;
       
       $scope.$callbacks = self.uiTreeCallbacks;
       
       self.toggleEditButtons = function(spec) {
          spec.showEditButtons = !spec.showEditButtons;
        };
     }
});
module.component('specs', {
     templateUrl: 'specs/specs.template.html',
     controller: function($http) {
       var self = this;
        
       this.$onInit = function(){
         $http.get('specs.json').then(function(response) {
            self.spec = response.data;
            console.log(self.spec);
        });
       };
     }
});
module.component('buttons', {
     templateUrl: 'specs/buttons.template.html',
     controller: function() {
       
     }
});