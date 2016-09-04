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
            controller: function ($scope, sessionService) {
                var vm = this;
                vm.routes = routes;
                vm.activeRoute = routeNavigation.activeRoute;
                vm.authenticated = authenticated;

                function routes() {
                    return routeNavigation.routes;
                }

                function authenticated() {
                    return sessionService.isAuthenticated();
                }
            },
            controllerAs: 'main'
        };
    };
})();
