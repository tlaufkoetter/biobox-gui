(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .directive('bioboxMeta', bioboxMeta);

    function bioboxMeta() {
        return {
            scope: true,
            restrict: "E",
            replace: true,
            templateUrl: "/static/angular/components/bioboxes/directives/biobox-meta.html"
        };
    };
})();
