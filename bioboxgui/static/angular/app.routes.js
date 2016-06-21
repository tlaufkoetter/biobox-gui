(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .config(routes)
        .run(runs);

    routes.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$windowProvider'];

    function routes($routeProvider, $locationProvider, $httpProvider, $windowProvider) {
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
                controller: "BioboxController",
                controllerAs: "main",
                resolve: {
                    interfaces: function (bioboxService) {
                        return bioboxService.getInterfaces()
                            .then(
                                function success(response) {
                                    console.log(response);
                                    return response.data;
                                },
                                function failure(response) {
                                    console.log(response);
                                    return response.status;
                                });
                    },
                    bioboxes: function (bioboxService) {
                        return bioboxService.getBioboxes().then(
                            function success(response) {
                                console.log(response);
                                return response.data;
                            },
                            function failure(response) {
                                return 'fail';
                            });
                    }
                }
            })
            .when('/bioboxgui/states', {
                templateUrl: '/static/angular/components/states/states.html',
                name: "States",
                controller: "BioboxController",
                controllerAs: "main"
            });
        $httpProvider.interceptors.push('responseInterceptor');
    };

    function runs($http, $q, $rootScope, $location, $route) {
        $rootScope.$location = $location;
        $rootScope.$route = $route;
        $rootScope.keys = Object.keys;
    };
})();
