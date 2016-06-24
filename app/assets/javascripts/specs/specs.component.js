module.component('specs', {
     templateUrl: 'specs/specs.template.html',
     controller: function($http, $q, $scope, $specs) {
        var self = this;
        
        var editingSpec;
        var editingCopy;
        
        self.setEditingSpec = function(spec){
            editingSpec = spec;
            editingCopy = angular.copy(spec);
        };
        
        self.getEditingSpec = function(){
            return {
                spec: editingSpec,
                copy: editingCopy
            };
        };
        
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