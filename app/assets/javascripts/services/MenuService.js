var module = angular.module('app');

module.service('MenuService', function() {
    var self = this;
    var callbacks = [];
    
    self.addChildren = false;
    
    self.addCallback = function(callback) {
        callbacks.push(callback);
    };
    
    self.toggleAddChildren = function() {
        self.addChildren = !self.addChildren;
        updateAll();
    };
    
    function updateAll() {
        callbacks.forEach(function(callback) {
            callback();
        });
    }
    
});