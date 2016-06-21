(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .directive('navigation', navigation);

    function navigation(routeNavigation) {
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
})();
