(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('AdministrationController', AdministrationController);

    function AdministrationController(userService, sourceService, Notification, $route, Constants) {
        var vm = this;

        vm.getUser = getUser;
        vm.getUsers = getUsers;
        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.grantPermission = grantPermission;
        vm.addSource = addSource;
        vm.deleteSource = deleteSource;
        vm.Roles = Constants.Roles;
        vm.roles = [];
        vm.users = [];
        vm.selected_user = {};

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
                            vm.roles = [];
                            for (var role in vm.selected_user.roles) {
                                vm.roles.push({
                                        name: role,
                                        disable: role == 'base',
                                        ticked: role == 'base'
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
                },
                function(error) {
                    Notification.error({
                        title: "User creation failed",
                        message: error.message
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

        function grantPermission(username, newRoles) {
            var roles = [];
            newRoles.forEach(function(role) {
                roles.push(vm.Roles[role.name]);
            });
            userService.grantPermission(username, roles)
                .then(
                    function() {
                        Notification.success("Granted permissions.");
                        $route.reload();
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
                            title: "Granting permissions failed",
                            message: message
                        });
                    }
                );
        }

        function addSource(source) {
            sourceService.addSource(source).then(
                function() {
                    Notification.success("Created new source");
                    $route.reload();
                },
                function(error) {
                    var message;
                    switch (error.status_code) {
                        case 400:
                            message = "The input is invalid. "
                                + "Maybe the source already exists "
                                + "or no valid source could be found at the given URL.";
                            break;
                        default:
                            message = error.message;
                    }
                    Notification.error({
                        title: "Adding source failed",
                        message: message
                    });
                }
            );
        }

        function deleteSource(name) {
            sourceService.deleteSource(name)
                .then(
                    function() {
                        Notification.success("Deleted source");
                        $route.reload();
                    },
                    function(error) {
                        var message;
                        switch (error.status_code) {
                            case 404:
                                message = "The source doesn't exist.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            title: "Deleting source failed",
                            message: message
                        });
                    }
                );
        }
    }

})();
