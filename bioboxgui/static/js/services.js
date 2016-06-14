'use strict';
var app = angular.module('BioboxGui'),

    BioboxService = function ($http) {
        this.$http = $http;
    },

    UserService = function ($http) {
        this.$http = $http;
    },

    TaskService = function ($http) {
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

BioboxService.prototype.addSource = function (source) {
    return this.$http.post('/bioboxgui/api/sources', source)
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

TaskService.prototype.submitTask = function (user, container, cmd, file) {
    var task = {};
    task.user = user;
    task.container = container;
    task.cmd = cmd;
    task.file = file;
    return this.$http.post('/bioboxgui/api/tasks', task);
};

TaskService.prototype.queryStates = function () {
    return this.$http.get('/bioboxgui/api/tasks');
};

BioboxService.$inject = ['$http', '$location'];
UserService.$inject = ['$http'];
RouteNavigation.$inject = ['$route', '$location'];

app.factory('routeNavigation', RouteNavigation);
app.service('BioboxService', BioboxService);
app.service('UserService', UserService);
app.service('TaskService', TaskService);
