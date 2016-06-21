'use strict';

var RegisterController = function (UserService, $location) {
    this.userService = UserService;
    this.$location = $location;
    this.user = {};
};

RegisterController.prototype.createUser = function () {
    var _this = this;
    if (_this.user !== {}) {
        _this.userService.createUser(_this.user)
            .then(
                function success(response) {
                    _this.$location.path('/bioboxgui/login');
                },

                function failure(response) {
                }
            );
    }
};

app.controller('RegisterController', RegisterController);


