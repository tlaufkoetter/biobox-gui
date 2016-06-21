'use strict';

var RouteNavigation = function ($route, $location) {
    var routes = [];
    angular.forEach($route.routes, function (route, path) {
        if (route.name) {
            routes.push({
                path: path,
                name: route.name
            });
        }
    });
    return {
        routes: routes,
        activeRoute: function (route) {
            return route.path === $location.path();
        }
    }
};

RouteNavigation.$inject = ['$route', '$location'];

app.factory('routeNavigation', RouteNavigation);