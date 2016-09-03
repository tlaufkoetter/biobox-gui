(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('LoginController', LoginController);

    function LoginController(loginService, Notification, $window) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (user !== {}) {
                loginService.login(user)
                    .then(
                            function() {
                                Notification.success("Login successful!");
                                $window.location.href = '#/bioboxgui';
                            },
                            function(status_code) {
                                var message;
                                switch (status_code) {
                                    case 404:
                                        message = "Either the user doesn't"
                                            + "exist or your credentials are invalid.";
                                        break;
                                    case 400:
                                        message = "Your request is invalid.";
                                        break;
                                    default:
                                        message = "There was an error.";
                                }
                                Notification.error({
                                    title: "Login was unsuccessful!",
                                    message: message
                                });
                            }
                         );
            } else {
                Notification.error("Please enter your credentials!");
            }
        };
    };
})();
