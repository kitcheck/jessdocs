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
         });
         
         $http.get('tags.json').then(function(response) {
            self.tags = response.data;
         });
         $http.get('specs.json').then(function(response) {
            self.spec = response.data.specs;
        });
        
        
       };
       
       self.getTickets = function(spec){
         var tickets = self.tickets[spec.id];
         console.log(tickets);
         return tickets;
       };
       
       self.getTags = function(spec){
         var id = spec.id;
         return self.tags[id];
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