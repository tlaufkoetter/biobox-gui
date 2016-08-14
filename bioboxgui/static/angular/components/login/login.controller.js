(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('LoginController', LoginController);

    function LoginController(loginService, sessionService, $window) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (user !== {}) {
                loginService.login(user)
                    .then(
                        function success(response) {
                            user.authentication_token = response.data.token;
                            sessionService.setCurrentUser(user);
                            $window.location.href = '#/bioboxgui';
                        },
                        function failure(response) {
                            console.log('what now');
                        }
                    )
            }
        };
    };
})();
