var module = angular.module('app');

module.controller('TagTypesController', function($scope, $mdDialog, $http, $filter, $tagtypes){
    $scope.editingObject;
    $scope.editingCopy;
    $scope.notifyWatchers = false;
    $scope.refreshModal = false;
    $scope.tag_type_groups = $tagtypes.tagTypesByGroup;
    $scope.selectedIndex = 0;
    $scope.editing = false;
    
    $scope.close = function() {
        $mdDialog.hide($scope.notifyWatchers);
    };
    
    $scope.clearEditing = function(){
        $scope.editingObject = null;
        $scope.editingCopy = {};
        $scope.editing = false;
    };
    
    $scope.save = function() {
        var editingTagGroup = angular.isUndefined($scope.editingCopy.tag_type_group_id);
        
        if(hasChanges($scope.editingObject, $scope.editingCopy)){
            if(editingTagGroup){
                if($scope.editingObject === null) {
                    createTagGroup($scope.editingCopy);
                }
                else {
                    editTagGroup($scope.editingCopy);
                }
            }
            else {
                if($scope.editingObject === null){
                    createTagType($scope.editingCopy);
                }
                else {
                    editTagType($scope.editingCopy);
                }
            }
            // if ($scope.refreshModal){
            //     $tagtypes.updateTagTypesByGroup().then( function(response){
            //         $scope.tag_type_groups = $tagtypes.tagTypesByGroup;
            //     });
            //     $scope.refreshModal = false;
            // }
            
            $scope.notifyWatchers = true;
            $scope.cancel();
        }
    };
    
    function createTagType(tagType) {
        var groupId = parseInt(tagType.tag_type_group_id);
        groupId = isNaN(groupId) ? null : groupId;
        $http({
            url: '/tag_types', 
            method: "POST",
            data: {
                id: tagType.id,
                tag_type: {
                    name: tagType.name,
                    color: tagType.color,
                    tag_type_group_id: groupId
                }}
        }).
        then(function (response) {
            $scope.tag_type_groups = response.data.tag_types;
        });
    }
    
    function editTagType(tagType) {
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
            $scope.tag_type_groups = response.data.tag_types;
        });
    }
    
    function createTagGroup(tagType) {
        $http({
            url: '/tag_type_groups', 
            method: "POST",
            data: {
                id: tagType.id,
                tag_type_group: {
                    name: tagType.name,
                    color: tagType.color
                }}
        }).
        then(function (response) {
            $scope.tagGroups.push(response.data);
        });
    }
    
    function editTagGroup(tagType) {
        $http({
            url: '/tag_type_groups/' + tagType.id, 
            method: "PUT",
            data: {
                id: tagType.id,
                tag_type_group: {
                    name: tagType.name,
                    color: tagType.color
                }}
        }).
        then(function (response) {
            
        });
    }
    
    $scope.disableSave = function() {
        return angular.isUndefined($scope.editingCopy.name)
    };
    
    $scope.cancel = function() {
        $scope.selectedIndex = 0;
        $scope.clearEditing();
    };
    
    $scope.initNew = function(groupId){
        if (!$scope.editing) {
            $scope.editingObject = null;
            $scope.editingCopy = {};
            $scope.editingCopy.color = "#000000";
            if(groupId){
                $scope.editingCopy.tag_type_group_id = "";
            }
        }
        //need this in all cases so we can push to it
        $scope.getTagGroups();
    };
    
    $scope.editTagType = function(tagtype){
        $scope.selectedIndex = 1;
        $scope.editingObject = tagtype;
        $scope.editingCopy = angular.copy(tagtype);
        $scope.editing = true;
    };
    
    function hasChanges(tagType, copy){
        if (tagType === null){
            return true;
        }
        var noChanges = ( 
            (tagType.name === copy.name) &&
            (tagType.color === copy.color) &&
            (tagType.tag_type_group_id == copy.tag_type_group_id)
        );
        return !noChanges;
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
            });
        }
    };

    
});