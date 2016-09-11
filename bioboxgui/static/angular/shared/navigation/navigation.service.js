(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .service('routeNavigation', routeNavigation);

    /**
     * service for route navigation.
     */
    function routeNavigation($route, $location) {
        var routes = [];
        angular.forEach($route.routes, function (route, path) {
            if (route.name) {
                routes.push({
                    path: path,
                    name: route.name,
                    require_login: route.require_login,
                    roles_accepted: route.roles_accepted
                });
            }
        });
        return {
            // all the routes
            routes: routes,
            // determines the active route
            activeRoute: function (route) {
                return route.path === $location.path();
            }
        };
    };
})();
