'use strict';
var app = angular.module('BioboxGui'),

    BioboxService = function ($http) {
        this.$http = $http;
    },

    UserService = function ($http) {
        this.$http = $http;
    },

    RouteNavigation = function ($route, $location) {
        var routes = [];
        angular.forEach($route.routes, function (route, path) {
            if (route.name) {
                routes.push({
                    path: path,
                    name: route.name
                });
            }
        });
        return {
            routes: routes,
            activeRoute: function (route) {
                return route.path === $location.path();
            }
        }
    };

BioboxService.prototype.getBioboxes = function () {
    return this.$http.get('/bioboxgui/api/bioboxes');
};

BioboxService.prototype.getBiobox = function (id) {
    return this.$http.get('bioboxgui/api/bioboxes/' + id);
};

BioboxService.prototype.updateBioboxes = function () {
    return this.$http.put('/bioboxgui/api/bioboxes');
};

BioboxService.prototype.getInterfaces = function () {
    return this.$http.get('/bioboxgui/api/interfaces');
};

BioboxService.prototype.getInterface = function (selectedInterface) {
    return this.$http.get('/bioboxgui/api/bioboxes?interface=' + selectedInterface);
};

UserService.prototype.createUser = function (user_info) {
    return this.$http.post('/bioboxgui/api/users', user_info);
};

UserService.prototype.login = function (user) {
    return this.$http.post('/bioboxgui/api/token', user);
};

BioboxService.$inject = ['$http', '$location'];
UserService.$inject = ['$http'];
RouteNavigation.$inject = ['$route', '$location'];

app.factory('routeNavigation', RouteNavigation);
app.service('BioboxService', BioboxService);
app.service('UserService', UserService);