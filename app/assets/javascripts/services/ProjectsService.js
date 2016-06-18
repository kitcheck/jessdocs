var module = angular.module('app');

module.service('$projects', function($http) {
    var self = this;
    
    self.projects;
    self.currentProject;
    
    // self.$onInit = function() {
        
    //     $http.get('projects.json').then(function(response) {
    //         self.projects = response.data;
    //         self.currentProject = self.projects[0].id;
    //     });
        
    // };
    
});