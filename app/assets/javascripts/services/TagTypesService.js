var module = angular.module('app');

module.service('$tagtypes', function($http, $q) {
    var self = this;
    
    self.tagTypes;
    
    self.getTagTypes = function() {
        if(self.tagTypes){
            return $q.when(self.tagTypes);
        }
        var promise = $http({
          url: '/tags/new', 
          method: 'GET'
        }).then(function(response) {
            self.tagTypes = response;
            return self.tagTypes;
        });
        return promise;
    };
});