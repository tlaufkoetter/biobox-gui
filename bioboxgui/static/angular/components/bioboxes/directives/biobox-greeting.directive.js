(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .directive('bioboxGreeting', bioboxGreeting);

    function bioboxGreeting() {
        return {
            scope: true,
            restrict: "E",
            replace: true,
            templateUrl: "/static/angular/components/bioboxes/directives/biobox-greeting.html"
        };
    };
})();