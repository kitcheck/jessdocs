var module = angular.module('jessdocs');

module.component('tags', {
    bindings: {
       tags: '<',
       spec: '<'
     },
     templateUrl: 'tags/tags.template.html',
     controller: function($http, $filter) {
        var self = this;
        self.selectedItem = null;
        self.searchText = null;
        
        self.transformChip = function(chip) {
            if (angular.isObject(chip)) {
                
                var found = $filter('filter')(self.tags, {name: chip.name}, true);
                if( found.length ) {
                    return null;
                }
                
                return chip;
            }
            return { name: chip, type: 'new' };
        };
        
        self.addTag = function(chip){
            $http({
              url: '/tags', 
              method: "POST",
              data: 
                {tag: {tag_type_id: chip.id,
                        spec_id: self.spec.id
              }}
          });  
        };
        
        self.querySearch = function(query) {
            var results = query ? self.spec.tagtypes.filter(createFilterFor(query)) : [];
            return results;
        };
        
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(tagtype) {
                return (tagtype.name.indexOf(lowercaseQuery) === 0);
            };
        }
        
    }
});