angular.
  module('sidebar', ['templates']).
  component('sidebar', {
    templateUrl: 'sidebar/sidebar.template.html',
    controller: ['$scope', '$http',
      function SidebarController($scope, $http) {
        var self = this;
        $scope.formData = {};
        
        $http.get('projects.json').then(function(response) {
            self.projects = response.data;
            $scope.formData.project = self.projects[0].id;
        });
        
        $http.get('tag_types.json').then(function(response) {
            self.tag_type_groups = response.data.tag_types.tag_types
        });
        
        
        
        $scope.submit = function() {
          
          console.log($scope.formData)
        };
        
      }
    ]
  });