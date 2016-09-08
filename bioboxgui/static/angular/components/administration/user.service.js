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

        function grantPermission(username, roles) {
            return $http.put('/bioboxgui/api/users/' + username, {roles: roles})
                .then(
                        function(response) {
                            return;
                        },
                        function(response) {
                            return $q.reject(response.status);
                        }
                    );
        }

        function deleteUser(username) {
            return $http.delete('/bioboxgui/api/users/' + username)
                .then(
                        function(response) {
                            return;
                        },
                        function(response) {
                            return $q.reject(response.status);
                        }
                    );
        }
    }
})();
