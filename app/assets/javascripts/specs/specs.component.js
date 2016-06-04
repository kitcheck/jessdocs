angular.
  module('specs', ['templates', 'ui.tree', 'RecursionHelper']).
  component('specs', {
    templateUrl: 'specs/specs.template.html',
    controller: ['$scope', '$http',
      function SpecsController($scope, $http) {
        
        $scope.toggleEditButtons = function(spec) {
          spec.showEditButtons = !spec.showEditButtons;
        };
        
        $http.get('specs.json').then(function(response) {
            $scope.specs = response.data;
            console.log($scope.specs);
        });
      }
    ]
  }).directive("spec",
    ['RecursionHelper', function(RecursionHelper) {

        return({

            compile: function(element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            },
            restrict: "E",
            templateUrl: "specs/spec.template.html"
        });
    }]
)