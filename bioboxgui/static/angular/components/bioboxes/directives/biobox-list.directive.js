(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .directive('bioboxList', bioboxList);

    function bioboxList() {
        return {
            scope: true,
            restrict: "E",
            replace: true,
            templateUrl: "/static/angular/components/bioboxes/directives/biobox-list.html"
        };
    };
})();
