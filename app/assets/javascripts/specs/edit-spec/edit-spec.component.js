var module = angular.module('app');
module.component('editSpec', {
    require: {
        parent: '^^spec'
    },
    bindings: {
        spec: '<',
        tag: '<',
        ticket: '<'
    },
    templateUrl: 'specs/edit-spec/edit-spec.template.html',
    controller: function() {
            
       var self = this;
       
        self.toggleEditButtons = function(spec) {
            self.parent.toggleEditButtons(spec);
        };
        
        self.toggleAddChildren = function(spec) {
            self.parent.toggleAddChildren(spec);
        };
    }
});