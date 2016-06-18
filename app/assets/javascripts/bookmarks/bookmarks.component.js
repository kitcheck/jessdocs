var module = angular.module('app');

module.component('bookmarks', {
     templateUrl: 'specs/bookmarks/bookmarks.template.html',
     controller: function($http) {
        var self = this;
        
        
        self.$onInit = function(){
            $http({
              url: '/specs/bookmarks', 
              method: "GET",
              data: 
                {project_id: project_id}
                
            });  
        };
        
    }
});