'use strict';

angular.module('BioboxGui').directive('navigation', function (routeNavigation) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/static/partials/navigation.html",
        controller: function ($scope) {
            $scope.routes = routeNavigation.routes;
            $scope.activeRoute = routeNavigation.activeRoute;
        }
    };
});