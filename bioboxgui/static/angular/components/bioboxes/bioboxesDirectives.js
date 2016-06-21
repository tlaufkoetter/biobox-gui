'use strict';

var BioboxListDirective = function () {
        return {
            scope: true,
            restrict: "A",
            templateUrl: "/static/angular/components/bioboxes/partials/biobox-list.html"
        };
    },

    BioboxMetaDirective = function () {
        return {
            scope: true,
            restrict: "A",
            templateUrl: "/static/angular/components/bioboxes/partials/biobox-meta.html"
        };
    },

    BioboxGreetingDirective = function () {
        return {
            scope: true,
            restrict: "A",
            templateUrl: "/static/angular/components/bioboxes/partials/biobox-greeting.html"
        };
    },

    BioboxDirective = function () {
        return {
            scope: true,
            restrict: "A",
            templateUrl: "/static/angular/components/bioboxes/partials/biobox.html"
        };
    };

app.directive('bioboxList', BioboxListDirective);
app.directive('bioboxMeta', BioboxMetaDirective);
app.directive('bioboxGreeting', BioboxGreetingDirective);
app.directive('biobox', BioboxDirective);