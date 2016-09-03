(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('userService', userService);

    function userService($http, $q, $log) {
        var service = {
                createUser: createUser,
                grantPermission: grantPermission,
                deleteUser: deleteUser,
            },
            currentUser = null;
        return service;

        function createUser(user) {
            var promise = $http.post('/bioboxgui/api/users', user)
                .then(
                        function(response) {
                            $log.info('Successfully create user:', user);
                        },
                        function(response) {
                            $log.warn('Failed to create user:', response);
                            return $q.reject(response.status);
                        }
                     );
            return promise;
        }

        function grantPermission(username, role) {
        }

        function deleteUser(user) {
        }
    }
})();
