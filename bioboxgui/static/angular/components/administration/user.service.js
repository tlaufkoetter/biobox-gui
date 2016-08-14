(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('userService', userService);

    function userService($http) {
        var service = {
                createUser: createUser,
                grantPermission: grantPermission,
                deleteUser: deleteUser,
            },
            currentUser = null;
        return service;

        function createUser(user) {
            $http.post('/bioboxgui/api/users', user)
                .then(
                    function success(response) {
                        console.log(response);
                        return response.status_code;
                    },
                    function error(response) {
                        console.log(response);
                        return response.status_code;
                    }
                )
        }

        function grantPermission(username, role) {
        }

        function deleteUser(user) {
        }
    }
})();
