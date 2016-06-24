var module = angular.module('app');

module.component('menu', {

     templateUrl: 'menu-buttons/menu.template.html',
     controller: function(
         $anchorScroll, 
         $location, 
         $mdDialog, 
         $http, 
         $tagtypes) {
             
        var self = this;
        self.isOpen = false;
        self.pageUp = false;
        
        self.togglePageUp = function(value){
             self.isOpen = value;
             self.pageUp = value;
        };
        
        self.scrollToTop = function(){
            $location.hash('top');
            $anchorScroll();
        };
        
        self.showTagTypesModal = function(ev){
            $mdDialog.show({
              controller: 'TagTypesController',
              templateUrl: 'tagtypes/tag-types.template.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
            }).then(function(refresh) {
                console.log('notify = ', refresh)
                if (refresh) {
                    $tagtypes.update();
                }
            }, function() {
                
            });
        };
        
    }
    
});