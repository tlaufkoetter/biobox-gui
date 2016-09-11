(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('loginService', loginService);

    /**
     * service handles logging in and out of the user.
     */
    function loginService(gatewayService, sessionService, $log, $q, $route) {
        var service = {
            login: login,
            logout: logout
        };
        return service;

        /**
         * logs in the user.
         */
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

        /**
         * logs the user out.
         */
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
