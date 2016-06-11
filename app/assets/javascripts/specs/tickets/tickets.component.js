var module = angular.module('jessdocs');

module.component('tickets', {
    bindings: {
       ticket: '<',
       spec: '<'
     },
     templateUrl: 'specs/tickets/tickets.template.html',
     controller: function() {
       var self = this;
       
       
     }
});
module.component('ticket', {
    bindings: {
       ticket: '<',
       spec: '<'
     },
     templateUrl: 'specs/tickets/ticket.template.html',
     controller: function() {
       var self = this;
       
       
     }
});