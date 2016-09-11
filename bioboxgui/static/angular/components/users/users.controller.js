(function() {
    'use strict';

    angular
        .module("BioboxGui")
        .controller("UserController", UserController);

    function UserController(users, userService, Notification, Constants, $rootScope, $route) {
        var vm = this;

        vm.getUser = getUser;
        vm.getUsers = getUsers;
        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        vm.Roles = Constants.Roles;
        vm.users = users;
        vm.selected_user = null;
        vm.user_roles = [];
        vm.roles = [];

        for (var role in vm.Roles) {
            vm.roles.push({
                    name: role,
                    disable: role == 'base',
                    ticked: role == 'base'
            });
        }
        
        function getUser(username) {
            userService.getUser(username)
                .then(
                        function(user) {
                            vm.selected_user = user;
                            vm.user_roles = [];
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

        function deleteUser(username) {
            userService.deleteUser(username)
                .then(
                    function() {
                        Notification.success("Deleted user: " + username);
                        $route.reload();
                        getUsers();
                        vm.selected_user = null;
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
