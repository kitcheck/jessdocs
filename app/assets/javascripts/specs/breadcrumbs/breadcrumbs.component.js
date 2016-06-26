var module = angular.module('app');

module.component('breadcrumbs', {

     templateUrl: 'specs/breadcrumbs/breadcrumbs.template.html',
     controller: function(BreadcrumbsService, $specs) {
             
        var self = this;
        self.breadcrumbs = null;
        
        self.$onInit = function(){
            BreadcrumbsService.addCallback( function(){
                self.breadcrumbs = BreadcrumbsService.breadcrumbs;
            });
        };
        
        self.setBreadcrumbs = function(spec){
            BreadcrumbsService.setBreadcrumbs(spec.id);
            var params = {spec_id: spec.id};
            
            $specs.setSpecList(params);
        };
        
        self.clearBreadcrumbs = function() {
            BreadcrumbsService.clearBreadcrumbs();
            
            $specs.setSpecList();
        };
    }
    
});