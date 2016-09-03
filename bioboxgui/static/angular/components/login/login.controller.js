(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('LoginController', LoginController);

    function LoginController(loginService, sessionService, Notification, $window) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (user !== {}) {
                loginService.login(user)
                    .then(
                            function(promise) {
                                Notification.success("Login successful!");
                                user.authentication_token = promise.token;
                                user.roles = promise.roles;
                                sessionService.setCurrentUser(user);
                                $window.location.href = '#/bioboxgui';
                            },
                            function(promise) {
                                Notification.error("Login was unsuccessful!");
                            }
                         );
            } else {
                Notification.error("Please enter your credentials!");
            }
        };
    };
})();
