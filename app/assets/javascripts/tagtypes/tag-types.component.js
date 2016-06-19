var module = angular.module('app');

module.controller('TagTypesController', function($scope, $mdDialog, $http, $filter, $tagtypes){
    $scope.editingTagType;
    $scope.editingCopy;
    $scope.tagGroups;
    $scope.notifyWatchers = false;
    $scope.refreshModal = false;
    $scope.tag_type_groups = $tagtypes.tagTypesByGroup;
    $scope.searching = false;
    $scope.selectedIndex = 0;
    
    this.$onInit = function(){
        alert('hi')
    }
    
    $scope.cancel = function() {
        $mdDialog.hide($scope.notifyWatchers);
    };
    
    $scope.toggleSearch = function(){
        $scope.searching = !$scope.searching;
        
        if (!$scope.searching){
            $scope.query = "";
        }
    };
    
    $scope.editTagType2 = function(tagtype){
        $scope.selectedIndex = 1;
    }
    
    $scope.editTagType = function(tagType) {
        tagType.isBeingEdited = !tagType.isBeingEdited;
        
        //if we weren't editing and now we are
        if (tagType.isBeingEdited){
            //if something was previously being edited
            if ($scope.editingTagType) {
                $scope.editingTagType.isBeingEdited = false;
                toggleEditOff($scope.editingTagType, $scope.editingCopy);
            }
            $scope.getTagGroups();
            $scope.editingTagType = tagType;
            $scope.editingCopy = angular.copy(tagType);
        }
        //if we are ceasing to edit
        else {
            toggleEditOff($scope.editingTagType, $scope.editingCopy);
            $scope.editingTagType = null;
            $scope.editingCopy = null;
        }
    };
    
    function toggleEditOff(tagType, copy){
        if(!hasNoChanges(tagType, copy)){
            var groupId = parseInt(tagType.tag_type_group_id);
            groupId = isNaN(groupId) ? null : groupId;
            $http({
                url: '/tag_types/' + tagType.id, 
                method: "PUT",
                data: {
                    id: tagType.id,
                    tag_type: {
                        name: tagType.name,
                        color: tagType.color,
                        tag_type_group_id: groupId
                    }}
            }).
            then(function (response) {
                $scope.notifyWatchers = true;
                console.log(response.data);
            });
        }
    }
    
    function hasNoChanges(tagType, copy){
        var noChanges = ( 
            (tagType.name === copy.name) &&
            (tagType.color === copy.color) &&
            (tagType.tag_type_group_id == copy.tag_type_group_id)
        );
        return noChanges;
    }
    
    $scope.changeTagGroup = function(tagType) {
        var groupId = tagType.tag_type_group_id;
        var group = $filter('getById')($scope.tagGroups, groupId);
        if (group){
            tagType.color = group.color;
        }
        $scope.refreshModal = true;
    };
    
    $scope.disableColorField = function(groupId){
        return groupId != null && 
                (groupId.length > 0
                || angular.isNumber(groupId));
    };
    
    $scope.getTagGroups = function(){
        if($scope.tagGroups){
            return true;
        }
        else {
            $http.get('tag_type_groups').then(function(response) {
                $scope.tagGroups = response.data;
                
                console.log($scope.tagGroups)
            });
        }
    }

    
});