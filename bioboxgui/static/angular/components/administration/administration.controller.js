(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('AdministrationController', AdministrationController);

    function AdministrationController(userService, sourceService, Notification, $route, Constants) {
        var vm = this;

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.grantPermission = grantPermission;
        vm.addSource = addSource;
        vm.deleteSource = deleteSource;
        vm.Roles = Constants.Roles;

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

        function grantPermission(username, outputroles) {
            var roles = [];
            outputroles.forEach(function(role) {
                roles.add(role.name);
            });
            userService.grantPermission(username, outputroles)
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
