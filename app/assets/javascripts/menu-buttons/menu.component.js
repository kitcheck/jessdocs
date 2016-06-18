var module = angular.module('app');

module.component('menu', {

     templateUrl: 'menu-buttons/menu.template.html',
     controller: function($scope, $window, $mdDialog, $http) {
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
        
        self.showTagTypesModal = function(ev){
            $mdDialog.show({
              controller: TagTypesController,
              templateUrl: 'tagtypes/tag-types.template.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              onShowing: getTagTypes(),
              scope: $scope,
              preserveScope: true
            });
        };
        
        function getTagTypes(){
            $http.get('tag_types.json').then(function(response) {
                $scope.tag_type_groups = response.data.tag_types.tag_types;
            
                console.log($scope.tag_type_groups)
            });
        }
    }
    
});

function TagTypesController($scope, $mdDialog) {
    $scope.editingTagType;
    
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.editTagType = function(tagType) {
        tagType.isBeingEdited = !tagType.isBeingEdited;
        
        if ($scope.editingTagType) {
            $scope.editingTagType.isBeingEdited = false;
        }
        if (tagType.isBeingEdited){
            $scope.editingTagType = tagType;
        }
        else {
            $scope.editingTagType = null;
        }
    };
}