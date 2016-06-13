var module = angular.module('jessdocs');

module.component('menu', {

     templateUrl: 'menu-buttons/menu.template.html',
     controller: function($window) {
        var self = this;
        self.isOpen = false;
        self.pageUp = false;
        
        self.togglePageUp = function(value){
             self.isOpen = value;
             self.pageUp = value;
        };
        
        self.scrollToTop = function(){
             $window.scrollTo(0, 0);
        };
    }
});