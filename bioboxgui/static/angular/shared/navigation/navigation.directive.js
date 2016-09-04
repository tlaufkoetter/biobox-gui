(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .directive('navigation', navigation);

    function navigation() {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/static/angular/shared/navigation/navigation.html",
            controller: 'NavigationController',
            controllerAs: 'main',
        };
    };
})();
