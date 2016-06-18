var module = angular.module('app');
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
     controller: function($http, $q, $scope, $specs) {
        var self = this;
        self.specsLoaded = false;
        
       self.$onInit = function(){
           
            var promises = {
                tickets: $http.get('tickets.json'),
                tags: $http.get('tags.json')
            };
            
            $q.all(promises).then( function(response) {
                self.tickets = response.tickets.data;
                self.tags = response.tags.data;
                
                $specs.addCallback(function callback() {
                    self.spec = $specs.specs;
                });
                $specs.setSpecList();
                // $specs.getSpecList().then( function(result) {
                //     self.spec = result.data;
                // });
                
                
                // if ($specs.specs){
                //     self.specs = $specs.specs;
                // }
                // else {
                //     $http.get('specs/filter_tag.json').then(function(response) {
                        
                //         specsService.specs = response.data;
                //         self.spec = specsService.specs;
                //     });
                // }
                
            });
            
             
         
       };
       
     
       
    //   $scope.$watch(function () {
    //         return $specs.specs;         
    //     }, function (value) {
    //         self.spec = value;
    //     });
       
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