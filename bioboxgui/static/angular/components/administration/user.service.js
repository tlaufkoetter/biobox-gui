(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('userService', userService);

    function userService(gatewayService, $q, $log) {
        var service = {
                createUser: createUser,
                grantPermission: grantPermission,
                deleteUser: deleteUser,
            },
            currentUser = null;
        return service;

        function createUser(user) {
            return gatewayService.post('/bioboxgui/api/users', user)
                .then(
                        function(response) {
                            $log.info('Successfully create user:', user);
                        },
                        function(response) {
                            $log.warn('Failed to create user');
                            return $q.reject(response);
                        }
                     );
        }

        function grantPermission(username, roles) {
            return gatewayService.put('/bioboxgui/api/users/' + username, {roles: roles})
                .then(
                        function(response) {
                            return;
                        },
                        function(response) {
                            $log.warn('Failed to grant permissions');
                            return $q.reject(response);
                        }
                    );
        }

        function deleteUser(username) {
            return gatewayService.delete('/bioboxgui/api/users/' + username)
                .then(
                        function(response) {
                            return;
                        },
                        function(response) {
                            $log.warn('Failed to delete user.');
                            return $q.reject(response);
                        }
                    );
        }
    }
})();
