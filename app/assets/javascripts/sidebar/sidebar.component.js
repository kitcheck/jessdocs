angular.
  module('sidebar', ['templates']).
  component('sidebar', {
    templateUrl: 'sidebar/sidebar.template.html',
    controller: ['$scope', '$http', '$httpParamSerializerJQLike', '$location',
      function SidebarController($scope, $http, $httpParamSerializerJQLike, $location) {
        $scope.formData = {};
        
        $http.get('projects.json').then(function(response) {
            $scope.projects = response.data;
            $scope.formData.project = $scope.projects[0].id;
        });
        
        $http.get('tag_types.json').then(function(response) {
            $scope.tag_type_groups = response.data.tag_types.tag_types
        });
        
        
        
        $scope.submit = function() {
          // var formParams = "?" + $httpParamSerializerJQLike($scope.formData);
          // $location.search($scope.formData);
          console.log($scope.formData)
          
          $http({
              url: '/specs/filter_tag', 
              method: "GET",
              params: {projects: {project_id: $scope.formData.project},
                      tag_types: $scope.formData.tag_types,
                      ticketed: $scope.formData.ticketed }
          });
        };
        
      }
    ]
  });