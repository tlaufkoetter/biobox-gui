(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('AdministrationController', AdministrationController);

    function AdministrationController(userService, sourceService) {
        var vm = this;

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.grantPermission = grantPermission;
        vm.addSource = addSource;
        vm.deleteSource = deleteSource;

        function createUser(user) {
            var code = userService.createUser(user);
        }

        function deleteUser(username) {
        }

        function grantPermission(username, role) {
        }

        function addSource(name, url) {
        }

        function deleteSource(url) {
        }
    }

})();