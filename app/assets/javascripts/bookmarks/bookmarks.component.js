var module = angular.module('app');

module.component('bookmarks', {
     templateUrl: 'bookmarks/bookmarks.template.html',
     controller: function(
         $mdSidenav, 
         BreadcrumbsService,
         $specs, 
         SidebarService) {
        var self = this;
        
        
        self.$onInit = function(){
            $specs.addCallback(function callback() {
                self.bookmarks = $specs.bookmarks;
            });  
            
            SidebarService.addCallback( function callback() {
                $mdSidenav('bookmarks').toggle();
            });
        };
        
        self.viewBookmark = function(bookmark){
            BreadcrumbsService.setBreadcrumbs(bookmark.id);
            var params = {spec_id: bookmark.id};
            $specs.setSpecList(params);
            $mdSidenav('bookmarks').close();
        };
        
    }
});