(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .service('loginService', loginService);

    function loginService($http, store) {
        var service = {
            login: login,
            register: register
        };
        return service;

        function register(user_info) {
            return $http.post('/bioboxgui/api/users', user_info);
        };

        function login(user) {
            return $http.post('/bioboxgui/api/token', user);
        };
    };
})();
