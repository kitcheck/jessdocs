var module = angular.module('jessdocs');

module.component('tickets', {
    bindings: {
       tickets: '<',
       spec: '<'
     },
     templateUrl: 'specs/tickets/tickets.template.html',
     controller: function() {
        var self = this;
     }
});