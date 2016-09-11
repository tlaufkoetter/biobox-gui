(function() {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('NavigationController', NavigationController);

    /**
     * controller handles some navigation requirements
     * like roles and authentication.
     */
    function NavigationController(routeNavigation, $rootScope) {
        var vm = this;

        // exposed methods
        vm.showRoute = showRoute;

        // data model
        vm.routes = routes;
        vm.activeRoute = routeNavigation.activeRoute;

        /**
         * determines whether the given route is to be displayed
         * in the navigation bar.
         */
        function showRoute(route) {
            var show;
            // check required roles first
            if (route.roles_accepted) {
                show = $rootScope.hasRole(route.roles_accepted);
            }
            // check if a login is requiered
            else if (route.require_login) {
                show = $rootScope.isAuthenticated()
            }
            // check if being logged out is necessary
            else if (route.require_login === null) {
                show = !$rootScope.isAuthenticated();
            } else {
                show = true;
            }
            return show;
        }

        /**
         * determines the routes at runtime.
         */
        function routes() {
            return routeNavigation.routes;
        }
    }
})();
