'use strict';

angular.module('BioboxGui', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/bioboxgui', {
            templateUrl: '/static/partials/home.html',
            name: "Home"
        })
        .when('/bioboxgui/bioboxes', {
            templateUrl: '/static/partials/biobox-list.html',
            name: "Bioboxes",
            controller: BioboxController,
            controllerAs: "main"
        })
        .when('/bioboxgui/about', {
            templateUrl: '/static/partials/about.html'
        })
        .otherwise({
            redirectTo: '/bioboxgui'
        });
    //$locationProvider.html5Mode(true);
}).run(function ($rootScope, $location, $route) {
    $rootScope.$location = $location;
    $rootScope.$route = $route;
    $rootScope.keys = Object.keys;
});
