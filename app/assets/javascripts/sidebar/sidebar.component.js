var module = angular.module('app');
module.
  component('sidebar', {
    templateUrl: 'sidebar/sidebar.template.html',
    controller: function ($http, $projects, $specs, $tagtypes) {
      var self = this;
      
      self.formData = {};
      self.selected = [];
      
      self.$onInit = function() {
        
        $projects.getProjects().then( function(response) {
            self.projects = response.data;
            self.formData.project = self.projects[0].id;
        });
        
        $tagtypes.getTagTypesByGroup().then( function(response){
            self.tag_type_groups = response;
        });
        
        $tagtypes.addCallback( function(){
            console.log('groups = ', $tagtypes.tagTypesByGroup)
            self.tag_type_groups = $tagtypes.tagTypesByGroup;
        });
        
      }; 
      
      
      self.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
        self.submit();
      };
      
      self.changeProject = function() {
        $projects.currentProject = self.formData.project;
        console.log('current project = ', $projects.currentProject);
        self.submit();
      };
        
      self.submit = function() {
        // var formParams = "?" + $httpParamSerializerJQLike($scope.formData);
        // $location.search($scope.formData);
        // console.log(self.formData)
        var params = {
          project_id: self.formData.project,
          "tag_types[]": self.selected,
          ticketed: self.formData.ticketed
        };
        
        $specs.setSpecList(params).then( function(result) {
          console.log(result);
        });
        
        // $http({
        //     url: '/specs/filter_tag', 
        //     method: "GET",
        //     params: {
        //       }
        // }).then( function(response) {
        //   $specs.specs = response.data;
        // });
      };
      
    }
    
  });