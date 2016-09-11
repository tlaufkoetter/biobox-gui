(function() {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('NavigationController', NavigationController);

    function NavigationController(routeNavigation, $rootScope) {
        var vm = this;

        vm.showRoute = showRoute;
        vm.routes = routes;
        vm.activeRoute = routeNavigation.activeRoute;

        function showRoute(route) {
            var show;
            if (route.roles_accepted) {
                show = $rootScope.hasRole(route.roles_accepted);
            } else if (route.require_login) {
                show = $rootScope.isAuthenticated()
            } else if (route.require_login === null) {
                show = !$rootScope.isAuthenticated();
            } else {
                show = true;
            }
            return show;
        }

        function routes() {
            return routeNavigation.routes;
        }
    }
})();
