'use strict';

var LoginController = function (UserService, $http, $window) {
    this.userService = UserService;
    this.$http = $http;
    this.$window = $window;
    this.user = {};
};

LoginController.prototype.login = function () {
    var _this = this;
    if (_this.user !== {}) {
        _this.userService.login(_this.user)
            .then(
                function success(response) {
                    if (response.data.response) {
                        _this.$http.defaults.headers.common['Authentication-Token'] = response.data.response.user.authentication_token;
                    }
                    _this.$window.location.href = '#/bioboxgui';
                },
                function failure(response) {
                    console.log('what now');
                }
            )
    }
};

app.controller('LoginController', LoginController);