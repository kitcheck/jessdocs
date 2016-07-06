var module = angular.module('app');

module.controller('ExportController', function($scope, $mdDialog, $http, exportHtml){
    
    $scope.exportData = exportHtml;
    
    $scope.close = function() {
        $mdDialog.hide();
    };
    
});