var module = angular.module('jessdocs');
module.component('spec', {
    require: {
        parent: '^^specs'
    },
    bindings: {
        spec: '<',
        uiTreeCallbacks: '=',
        tag: '<',
        ticket: '<'
    },
    templateUrl: 'specs/spec.template.html',
    controller: function($scope, $http) {
       var self = this;

       $scope.$callbacks = self.uiTreeCallbacks;
       
       self.toggleEditButtons = function(spec) {
          spec.showEditButtons = !spec.showEditButtons;
          if (spec.showEditButtons) {
            self.getAvailableTagTypes(spec);
          }
          
        };
        
        self.getAvailableTagTypes = function(spec){
            $http({
              url: '/tags/new', 
              method: 'GET',
              params: {
                  id: spec.id
              }
            }).then(function(response) {
                spec.tagtypes = response.data;
            });
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
         });
         
         $http.get('tags.json').then(function(response) {
            self.tags = response.data;
         });
         $http.get('specs.json').then(function(response) {
            self.spec = response.data.specs;
        });
        
        
       };
       
       self.getTickets = function(spec){
         return self.tickets[spec.id];
       };
       
       self.getTags = function(spec){
         return self.tags[spec.id];
       };
     }
});
module.component('buttons', {
    bindings: {
        spec: '<'
    },
    templateUrl: 'specs/buttons.template.html',
    controller: function($mdDialog, $http) {
        var self = this;
        
        self.associateTicket = function(ev, spec) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('associate ticket')
              .placeholder('#000000000')
              .ariaLabel('ticket number')
              .targetEvent(ev)
              .ok('associate')
              .cancel('cancel');
            $mdDialog.show(confirm).then(function(result) {
              self.ticket = result;
              console.log(result);
              if (self.ticket){
                  $http({
                      url: '/tickets', 
                      method: "POST",
                      data: 
                        {ticket: {name: self.ticket,
                                spec_id: spec.id
                      }}
                  });
              }
            });
        };
     }
});