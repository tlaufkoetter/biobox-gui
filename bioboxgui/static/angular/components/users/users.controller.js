(function() {
    'use strict';

    angular
        .module("BioboxGui")
        .controller("UserController", UserController);

    /**
     * controller handles user management.
     *
     * @param users prefetched while routing
     */
    function UserController(users, userService, Constants, Notification, $route, $rootScope) {
        var vm = this;

        // exposed methods
        vm.getUser = getUser;
        vm.getUsers = getUsers;
        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        // available roles
        vm.Roles = Constants.Roles;

        // data model
        vm.users = users;
        vm.selected_user = null;
        vm.user_roles = [];
        vm.roles = [];

        // prepares the roles for selection
        for (var role in vm.Roles) {
            vm.roles.push({
                    name: role,
                    // base is mandatory
                    disable: role == 'base',
                    ticked: role == 'base'
            });
        }
        
        /**
         * queries a user with the given name.
         */
        function getUser(username) {
            userService.getUser(username)
                .then(
                        function(user) {
                            vm.selected_user = user;
                            vm.user_roles = [];
                            // prepares the roles for selection
                            for (var role in vm.Roles) {
                                var hasRole = $rootScope.hasUserRole(user, [role]);
                                vm.user_roles.push({
                                        name: role,
                                        disable: role == 'base',
                                        ticked: role == 'base' || hasRole == 1
                                });
                            }
                        },
                        function(error) {
                            var message;
                            switch (error.status_code) {
                                case 404:
                                    message = "User doesn't exist.";
                                    break;
                                default:
                                    message = error.message;
                            }
                            Notification.error({
                                title: "Failed to get user",
                                message: message
                            });
                        }
                    );
        }

        /**
         * queries a list of all the users.
         */
        function getUsers() {
            userService.getUsers()
                .then(
                        function(users) {
                            vm.users = users;
                        },
                        function(error) {
                            Notification.error({
                                title: "Failed to get users",
                                message: error.message
                            });
                        }
                    );
        }

        /**
         * creates the given user.
         */
        function createUser(user) {
            userService.createUser(user).then(
                function() {
                    Notification.success("Created new user.");
                    $route.reload();
                    getUsers();
                    getUser(user.username);
                },
                function(error) {
                    Notification.error({
                        title: "User creation failed",
                        message: error.message
                    });
                }
            );
        }

        /**
         * updates the user with the given name.
         */
        function updateUser(username, user) {
            var roles = [];
            var name = user.username ? user.username.slice(0) : username;
            user.rawRoles.forEach(function(role) {
                roles.push(vm.Roles[role.name]);
            });
            user.roles = roles;
            userService.updateUser(username, user)
                .then(
                    function() {
                        Notification.success("Updated User.");
                        getUsers();
                        getUser(name);
                    },
                    function(error) {
                        var message;
                        switch(error.status_code) {
                            case 404:
                                message = "User or roles could not be found.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            title: "Updating user failed",
                            message: message
                        });
                    }
                );
        }

        /**
         * deletes the user with the given name.
         */
        function deleteUser(username) {
            userService.deleteUser(username)
                .then(
                    function() {
                        Notification.success("Deleted user: " + username);
                        $route.reload();
                        getUsers();
                    },
                    function(error) {
                        var message;
                        switch(error.status_code) {
                            case 404:
                                message = "The user "
                                    + username + " doesn't exist.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            title: "User deletion failed",
                            message: message
                        });
                    }
                );
        }
    }
})();
