(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .config(routes)
        .run(runs);

    routes.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$windowProvider', 'Constants'];

    function routes($routeProvider, $locationProvider, $httpProvider, $windowProvider, Constants) {
        $routeProvider
            .when('/', {
                redirectTo: '/bioboxgui',
                require_login: false,
                roles_accepted: null
            })
            .when('/bioboxgui', {
                templateUrl: '/static/angular/components/home/home.html',
                name: "Home",
                require_login: false,
                roles_accepted: null
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
                },
                require_login: false,
                roles_accepted: null
            })
            .when('/bioboxgui/states', {
                templateUrl: '/static/angular/components/states/states.html',
                name: "States",
                controller: "StateController",
                controllerAs: "main",
                resolve: {
                    states: function (stateService) {
                        return stateService.queryStates();
                    }
                },
                require_login: true,
                roles_accepted: [Constants.Roles['user']]
            })
            .when('/bioboxgui/administration', {
                templateUrl: '/static/angular/components/administration/administration.html',
                name: 'Administration',
                controller: "AdministrationController",
                controllerAs: "main",
                require_login: true,
                roles_accepted: [Constants.Roles['trusted'], Constants.Roles[ 'admin']]
            })
            .when('/bioboxgui/login', {
                templateUrl: '/static/angular/components/login/login.html',
                name: 'Login',
                controller: "LoginController",
                controllerAs: "login",
                require_login: null, // tenary bools ftw, basically a "require_logged_out",
                roles_accepted: null
            })
            .when('/bioboxgui/logout', {
                name: 'Logout',
                redirectTo: '/bioboxgui',
                resolve: {
                    logout: function($route, loginService, Notification) {
                        loginService.logout()
                            .then(
                                    function(response) {
                                        $route.reload();
                                        Notification.success("Logged out");
                                    }
                                 );
                    }
                },
                require_login: true,
                roles_accepted: [Constants.Roles['base']]
            });
        $httpProvider.interceptors.push('responseInterceptor');
    };

    function runs($http, $q, $rootScope, $location, $route) {
        $rootScope.$location = $location;
        $rootScope.$route = $route;
        $rootScope.keys = Object.keys;
    };
})();
