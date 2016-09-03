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
        }

        function grantPermission(username, role) {
        }

        function addSource(source) {
            sourceService.addSource(source).then(
                function success() {
                    alert('Yay');
                },
                function failure() {
                    alert(':(');
                }
            );
        }

        function deleteSource(url) {
        }
    }

})();
