(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .service('userService', userService);

    function userService($http) {
        var service = {
            createUser: createUser,
            login: login
        };
        return service;

        function createUser(user_info) {
            return $http.post('/bioboxgui/api/users', user_info);
        };

        function login(user) {
            return $http.post('/bioboxgui/api/token', user);
        };
    };
})();
