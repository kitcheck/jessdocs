var module = angular.module('app');
module.component('toolbar', {
    templateUrl: 'toolbar/toolbar.template.html',
    controller: function(SidebarService) {
        var self = this;
        
        self.toggleBookmarks = function() {
            SidebarService.toggle();
        };
    }
});