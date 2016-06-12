var module = angular.module('jessdocs');

module.component('tags', {
    bindings: {
       tags: '<',
       spec: '<'
     },
     templateUrl: 'tags/tags.template.html',
     controller: function($http) {
        var self = this;
        self.selectedItem = null;
        self.searchText = null;
        
        self.$onInit = function(){
            $http.get('tag_types/new.json').then(function(response) {
                self.tagtypes = response.data;
            });
        };
        
        self.transformChip = function(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
            return { name: chip, type: 'new' };
        };
        
        self.querySearch = function(query) {
            var results = query ? self.tagtypes.filter(createFilterFor(query)) : [];
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