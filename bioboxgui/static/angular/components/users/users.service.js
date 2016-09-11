(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('userService', userService);

    function userService(gatewayService, $q, $log, Constants) {
        var service = {
                getUser: getUser,
                getUsers: getUsers,
                createUser: createUser,
                updateUser: updateUser,
                deleteUser: deleteUser,
            },
            currentUser = null;
        return service;

        function getUser(username) {
            return gatewayService.get('/users/' + username)
                .then(
                        function(response) {
                            var user = response.data.user;
                            $log.info('Get user: ', user);
                            var roles = [];
                            user.roles.forEach(function(role) {
                                for (var prop in Constants.Roles) {
                                    if (Constants.Roles[prop] == role.name) {
                                        roles.push(prop);
                                        break;
                                    }
                                }
                            });
                            user.roles = roles;
                            return user;
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

        function updateUser(username, user) {
            return gatewayService.put('/users/' + username, user)
                .then(
                        function(response) {
                            return;
                        },
                        function(response) {
                            $log.warn('Failed to update user');
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
