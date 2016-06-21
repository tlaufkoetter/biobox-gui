'use strict';

var NavigationDirective = function (routeNavigation) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/static/angular/shared/navigation/navigation.html",
        controller: function ($scope) {
            $scope.routes = routeNavigation.routes;
            $scope.activeRoute = routeNavigation.activeRoute;
        }
    };
};

app.directive('navigation', NavigationDirective);