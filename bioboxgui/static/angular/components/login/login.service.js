(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('loginService', loginService);

    function loginService($log, $q, $route, sessionService, gatewayService) {
        var service = {
            login: login,
            logout: logout
        };
        return service;

        function login(user) {
            return gatewayService.post('/token', user)
                .then(
                        function(response) {
                            $log.info("logged in: ", user);
                            var token = response.data.token;
                            var roles = response.data.roles;
                            if (token && roles) {
                                user.authentication_token = token;
                                user.roles = roles;
                                sessionService.setCurrentUser(user);
                            } else {
                                return $q.reject({
                                    status_code: reponse.status,
                                    message: "Login failed somehow."
                                });
                            }
                        },
                        function(response) {
                            $log.warn("login failed: ", response);
                            return $q.reject(response);
                        }
                     );
        }

        function logout() {
            return gatewayService.delete('/token')
                .then(
                        function(response) {
                            $log.info("logged out");
                            sessionService.setCurrentUser(null);
                        },
                        function(response) {
                            $log.warn("logging out failed");
                            return response;
                        }
                     );
        }
    };
})();
