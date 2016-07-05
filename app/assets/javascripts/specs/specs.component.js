module.component('specs', {
     templateUrl: 'specs/specs.template.html',
     controller: function(
        $anchorScroll,
        $http,
        $location,
        $q, 
        $scope, 
        $specs,
        MenuService) {
        var self = this;
        
        var editingSpec;
        var editingCopy;
        self.exportSpecs = [];
        self.addChildren;
        
        self.toggleExport = function(spec){
            // spec.exported = !spec.exported || true;
            console.log(spec.exported);
            
            var id = spec.id;
            var idx = self.exportSpecs.indexOf(id);
            
            if (idx > -1) {
                recursiveCheck(spec, false);
            }
            else {
                recursiveCheck(spec, true);
            }
            console.log(spec.exported);
        };
        
        function recursiveCheck(spec, checked){
            spec.exported = checked;
            var id = spec.id;
            var idx = self.exportSpecs.indexOf(id);
            if (idx <= -1 && checked) {
                //if already in array, don't add twice
                self.exportSpecs.push(id);
            }
            else if (idx > -1 && !checked){
                self.exportSpecs.splice(idx, 1);
            }
            
            spec.children.forEach( function(child){
                recursiveCheck(child, checked); 
            });
            
        }
        
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
           MenuService.addCallback( function(){
                self.addChildren = MenuService.addChildren;
                $location.hash('bottom');
                $anchorScroll();
           });
           
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
       
       self.cancelAdd = function(spec) {
           if(spec){
               spec.addChildren = false;
           }
           else {
               self.addChildren = false;
           }
              
        };
    
     }
});