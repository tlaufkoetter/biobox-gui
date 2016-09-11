(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('userService', userService);

    function userService(gatewayService, $q, $log) {
        var service = {
                getUser: getUser,
                getUsers: getUsers,
                createUser: createUser,
                grantPermission: grantPermission,
                deleteUser: deleteUser,
            },
            currentUser = null;
        return service;

        function getUser(username) {
            return gatewayService.get('/users/' + username)
                .then(
                        function(response) {
                            $log.info('Get user: ', response.data.user);
                            return response.data.user;
                        },
                        function(response) {
                            $log.warn('Failed to get user ', username);
                            return $q.reject(response);
                        }
                    );
        }

        function getUsers() {
            return gatewayService.get('/users')
                .then(
                        function(response) {
                            $log.info('Get users: ', response.data.users);
                            return response.data.users;
                        },
                        function(response) {
                            return $q.reject(response);
                        }
                    );
        }

        function createUser(user) {
            return gatewayService.post('/users', user)
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
            return gatewayService.put('/users/' + username, {roles: roles})
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
            return gatewayService.delete('/users/' + username)
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
