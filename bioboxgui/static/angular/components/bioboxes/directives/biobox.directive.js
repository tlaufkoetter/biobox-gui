(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .directive('biobox', biobox);

    function biobox() {
        return {
            scope: true,
            restrict: "E",
            replace: true,
            templateUrl: "/static/angular/components/bioboxes/directives/biobox.html"
        };
    };
})();
