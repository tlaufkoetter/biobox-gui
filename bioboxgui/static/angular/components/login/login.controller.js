(function () {

    'use strict';

    angular
        .module('BioboxGui')
        .controller('LoginController', LoginController);

    function LoginController(userService, $http, $window) {
        var vm = this;
        vm.user = {};

        function login() {
            if (vm.user !== {}) {
                userService.login(user)
                    .then(
                        function success(response) {
                            if (response.data.response) {
                                $http.defaults.headers.common['Authentication-Token'] = response.data.response.user.authentication_token;
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
