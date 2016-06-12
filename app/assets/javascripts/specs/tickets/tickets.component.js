var module = angular.module('jessdocs');

module.component('tickets', {
    bindings: {
       tickets: '<',
       spec: '<'
     },
     templateUrl: 'specs/tickets/tickets.template.html',
     controller: function($http, $filter) {
        var self = this;
        
        self.transformChip = function(chip) {
            var chipName = chip.name || chip;
            var found = $filter('filter')(self.tickets, {name: chipName}, true);
            
            if( found.length ) {
                return null;
            }
            
            if (angular.isObject(chip)) {
                
                return chip;
            }
        
            return { name: chip, type: 'new' };
        };
        
        self.addTicket = function(chip){
            $http({
              url: '/tickets', 
              method: "POST",
              data: 
                {ticket: {name: chip.name,
                        spec_id: self.spec.id
              }}
            });  
        };
        
        self.removeTicket = function(chip){
            console.log(chip);
            $http({
              url: '/tickets/remove', 
              method: "POST",
              data: {name: chip.name,
                    spec_id: self.spec.id
              }
            }); 
        };
        
    }
});