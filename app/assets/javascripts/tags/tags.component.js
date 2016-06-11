var module = angular.module('jessdocs');

module.component('tags', {
    bindings: {
       tags: '<',
       spec: '<'
     },
     templateUrl: 'tags/tags.template.html',
     controller: function() {
       var self = this;
       
       
     }
});
module.component('tag', {
    bindings: {
       tag: '<',
       spec: '<'
     },
     templateUrl: 'tags/tag.template.html',
     controller: function() {
       var self = this;
       
       
     }
});