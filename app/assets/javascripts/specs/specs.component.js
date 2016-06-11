var module = angular.module('jessdocs');
module.component('spec', {
    require: {
        parent: '^^specs'
    },
    bindings: {
        spec: '<',
        uiTreeCallbacks: '=',
        tag: '<'
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
        
       self.$onInit = function(){
         $http.get('tickets.json').then(function(response) {
            self.tickets = response.data;
            console.log(self.tickets);
         });
         $http.get('tags.json').then(function(response) {
            self.tags = response.data;
            console.log(self.tags);
         });
         $http.get('specs.json').then(function(response) {
            self.spec = response.data.specs;
        });
        
        
       };
       self.getTickets = function(spec){
         return self.tickets[spec.id]  
       };
       self.getTags = function(spec){
         var id = spec.id;
         return self.tags[id];
       };
     }
});
module.component('buttons', {
     templateUrl: 'specs/buttons.template.html',
     controller: function() {
         
     }
});