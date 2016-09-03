(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('loginService', loginService);

    function loginService($http, $log, store) {
        var service = {
            login: login,
        };
        return service;

        function login(user) {
            var promise = $http.post('/bioboxgui/api/token', user)
                .success(function(data, status, headers, config) {
                    $log.info("logged in: ", user);
                    return data;
                }).error(function(data, status, headers, config) {
                    $log.warn("login failed: ", status);
                    return {status: false};
                });
            return promise;
        }
    };
})();
