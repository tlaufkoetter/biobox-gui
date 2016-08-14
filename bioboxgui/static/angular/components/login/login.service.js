(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('loginService', loginService);

    function loginService($http, store) {
        var service = {
            login: login,
        };
        return service;

        function login(user) {
            return $http.post('/bioboxgui/api/token', user);
        };
    };
})();
