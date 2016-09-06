(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('AdministrationController', AdministrationController);

    function AdministrationController(userService, sourceService, Notification) {
        var vm = this;

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.grantPermission = grantPermission;
        vm.addSource = addSource;
        vm.deleteSource = deleteSource;

        function createUser(user) {
            userService.createUser(user).then(
                    function() {
                        Notification.success("Created new user.");
                    },
                    function(status_code) {
                        var message;
                        switch (status_code) {
                            case 401:
                                message = "You are not logged in.";
                                break;
                            case 400:
                                message = "Please check your input.";
                                break;
                            case 403:
                                message = "You lack the rights to do that.";
                                break;
                            default:
                                message = "Something went wrong. " + promise.status;
                        }
                        Notification.error({
                            message: message,
                            title: "User creation failed"
                        });
                    }
            );
        }

        function deleteUser(username) {
               userService.deleteUser(username)
                   .then(
                           function() {
                               Notification.success("Deleted user: " + username);
                           },
                           function(status_code) {
                               var message;
                               switch(status_code) {
                                   case 400:
                                       message = "Please check your input.";
                                       break;
                                   case 401:
                                       message = "You are not logged in";
                                       break;
                                   case 403:
                                       message = "You are not allowed to do that.";
                                       break;
                                   case 404:
                                       message = "The user "
                                           + username + " doesn't exist.";
                                       break;
                                   default:
                                       message = "Something went wrong.";
                               }
                               Notifcation.error({
                                   "title": "User deletion failed",
                                   "message": message
                               });
                           }
                       );
        }

        function grantPermission(username, role) {
        }

        function addSource(source) {
            sourceService.addSource(source).then(
                function() {
                    Notification.success("Created new source");
                },
                function(status_code) {
                    var message;
                    switch (status_code) {
                        case 400:
                            message = "The input is invalid. "
                                + "Maybe the source already exists "
                                + "or no valid source could be found at the given URL.";
                            break;
                        case 401:
                            message = "You're not logged in.";
                            break;
                        case 403:
                            message = "You're not allowed to do that.";
                            break;
                        default:
                            message = "Something went wrong.";
                    }
                    Notification.error({title: "Adding source failed", message: message});
                }
            );
        }

        function deleteSource(url) {
        }
    }

})();
