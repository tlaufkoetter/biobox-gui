(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('LoginController', LoginController);

    function LoginController(loginService, userService, $window) {
        var vm = this;
        vm.user = {};
        vm.login = login;

        function login() {
            if (vm.user !== {}) {
                loginService.login(vm.user)
                    .then(
                        function success(response) {
                            if (response.data.response) {
                                vm.user.authentication_token = response.data.response.user.authentication_token;
                                userService.setCurrentUser(vm.user);
                            }
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
