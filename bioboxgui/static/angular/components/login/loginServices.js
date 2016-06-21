'use strict';

var UserService = function ($http) {
    this.$http = $http;
};

UserService.prototype.createUser = function (user_info) {
    return this.$http.post('/bioboxgui/api/users', user_info);
};

UserService.prototype.login = function (user) {
    return this.$http.post('/bioboxgui/api/token', user);
};

app.service('UserService', UserService);