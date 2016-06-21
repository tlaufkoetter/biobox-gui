'use strict';

app.config(function ($routeProvider, $locationProvider, $httpProvider, $windowProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/bioboxgui'
        })
        .when('/bioboxgui', {
            templateUrl: '/static/angular/components/home/home.html',
            name: "Home"
        })
        .when('/bioboxgui/bioboxes', {
            templateUrl: '/static/angular/components/bioboxes/bioboxes.html',
            name: "Bioboxes",
            controller: BioboxController,
            controllerAs: "main"
            // resolve: {
            //     authorize: function ($http) {
            //         return $http.get('/bioboxgui/api/bioboxes');
            //     }
            // }
        })
        .when('/bioboxgui/bioboxes/:pmid', {
            templateUrl: '/static/angular/components/bioboxes/bioboxes.html',
            controller: BioboxController,
            controllerAs: "main"
        })
        .when('/bioboxgui/states', {
            templateUrl: '/static/angular/components/states/states.html',
            name: "States",
            controller: BioboxController,
            controllerAs: "main"
        })
        .when('/bioboxgui/about', {
            templateUrl: '/static/partials/about.html'
        })
    // .when('/bioboxgui/login', {
    //     templateUrl: '/static/partials/login.html',
    //     controller: LoginController,
    //     controllerAs: "login"
    // })
    // .when('/bioboxgui/register', {
    //     templateUrl: '/static/partials/register.html',
    //     controller: RegisterController,
    //     controllerAs: "register"
    // })
    ;
    $httpProvider.interceptors.push('responseInterceptor');
}).run(function ($http, $q, $rootScope, $location, $route) {
    $rootScope.$location = $location;
    $rootScope.$route = $route;
    $rootScope.keys = Object.keys;
});