(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('responseInterceptor', responseInterceptor);

    /**
     * intercepts http movement in any direction and applies
     * defaults if necessary.
     */
    function responseInterceptor(sessionService, $window, $q) {
        // exposed methods
        var interceptor = {
            request: request,
            responseError: responseError
        };
        return interceptor;

        /**
         * adds the authentication token to the request header
         * if the user is logged in.
         */
        function request(config) {
            var currentUser = sessionService.getCurrentUser(),
                token = currentUser ? currentUser.authentication_token : null;
            config.headers['Authorization'] = 'Bearer ' + token;
            return config;
        };

        /**
         * handles error cases of a response.
         *
         * if the user is not authenticated the current user is deleted
         * from the cache an a redirect to the login page is performed.
         *
         * if the server claims that another application is at fault,
         * a redirect to the homepage is performed. this could mean
         * that the jobproxy or mesos scheduler are not running.
         */
        function responseError(response) {
            switch (response.status) {
                case 401:
                    $window.location.href = '#/bioboxgui/login';
                    sessionService.setCurrentUser(null);
                    break;
                case 502:
                    $window.location.href = '#/bioboxgui';
                    break;
            }
            return $q.reject(response);
        };
    };
})();
