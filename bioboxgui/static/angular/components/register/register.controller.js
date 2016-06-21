(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('RegisterController', RegisterController);

    function RegisterController(userService, $location) {
        var vm = this;

        $location = $location;
        vm.user = {};
        vm.createUser = createUser;

        function createUser() {
            if (vm.user !== {}) {
                userService.createUser(vm.user)
                    .then(
                        function success(response) {
                            $location.path('/bioboxgui/login');
                        },

                        function failure(response) {
                        }
                    );
            }
        };
    };
})();
