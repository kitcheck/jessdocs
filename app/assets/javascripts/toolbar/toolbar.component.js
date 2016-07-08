var module = angular.module('app');
module.component('toolbar', {
    templateUrl: 'toolbar/toolbar.template.html',
    controller: function($http, SidebarService) {
        var self = this;
        
        self.$onInit = function() {
            getCurrentUser();
        };
        
        self.toggleBookmarks = function() {
            SidebarService.toggle();
        };
        
        self.openUserMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };
        
        self.logout = function() {
            $http({
                url: '/users/sign_out', 
                method: "DELETE",
            });
        };
        
        function getCurrentUser() {
            $http.get('/users/current_user_info').then( function(response){
                self.user = response.data;
                formatName();
            });
        }
        
        function formatName() {
            if (self.user.name){
                self.name = self.user.name;
            }
            else {
                self.name = self.user.email;
            }
        }
    }
});