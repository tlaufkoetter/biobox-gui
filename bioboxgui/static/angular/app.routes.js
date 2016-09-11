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
                        return bioboxService.getInterfaces();
                    },
                    bioboxes: function (bioboxService) {
                        return bioboxService.getBioboxes();
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
                roles_accepted: [Constants.Roles.common]
            })
            .when('/bioboxgui/users', {
                templateUrl: '/static/angular/components/users/users.html',
                name: 'User Administration',
                controller: "UserController",
                controllerAs: "main",
                require_login: true,
                roles_accepted: [Constants.Roles.admin],
                resolve: {
                    users: function(userService) {
                        return userService.getUsers();
                    }
                }
            })
            .when('/bioboxgui/sources', {
                templateUrl: '/static/angular/components/sources/sources.html',
                name: 'Source Administration',
                controller: "SourceController",
                controllerAs: "main",
                require_login: true,
                roles_accepted: [Constants.Roles.admin, Constants.Roles.trusted],
                resolve: {
                    sources: function(sourceService) {
                        return sourceService.getSources();
                    }
                }
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
                roles_accepted: [Constants.Roles.base]
            });
        $httpProvider.interceptors.push('responseInterceptor');
    };

    function runs($http, $q, $rootScope, $location, $route) {
        $rootScope.$location = $location;
        $rootScope.$route = $route;
        $rootScope.keys = Object.keys;
    };
})();
