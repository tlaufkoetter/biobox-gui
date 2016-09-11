(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('userService', userService);

    /**
     * service manages the REST API of the users.
     */
    function userService(gatewayService, $q, $log, Constants) {
        // exposed methods
        var service = {
                getUser: getUser,
                getUsers: getUsers,
                createUser: createUser,
                updateUser: updateUser,
                deleteUser: deleteUser,
        };
        return service;

        /**
         * queries the user with the given name
         */
        function getUser(username) {
            return gatewayService.get('/users/' + username)
                .then(
                        function(response) {
                            var user = response.data.user;
                            $log.info('Get user: ', user);
                            var roles = [];
                            // reverse engeniering the roles
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

        /**
         * queries all the users.
         */
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

        /**
         * creates the given user.
         */
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

        /**
         * updates the user with the given name.
         */
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

        /**
         * deletes the given user.
         */
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
