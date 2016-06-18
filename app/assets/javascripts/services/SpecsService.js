var module = angular.module('app');

module.service('$specs', function($http, $q) {
    var self = this;
    var callbacks = [];
    
    self.addCallback = function(callback) {
        callbacks.push(callback);
    };
    
    self.setSpecList = function(filterParams) {
        var promise = $http({
            url: '/specs/filter_tag', 
            method: "GET",
            params: filterParams
        }).
        then(function (response) {
            self.specs = response.data.specs;
            self.bookmarks = response.data.bookmarks;
            updateAll();
            return self.specs;
        });
        return promise;
    };
    
    function updateAll() {
        callbacks.forEach(function(callback) {
            callback();
        });
    }
    
});