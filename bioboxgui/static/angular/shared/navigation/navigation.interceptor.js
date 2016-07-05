(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('responseInterceptor', responseInterceptor);

    function responseInterceptor($window, $q, userService) {
        var interceptor = {
            request: request,
            responseError: responseError
        };
        return interceptor;

        function request(config) {
            var currentUser = userService.getCurrentUser(),
                token = currentUser ? currentUser.authentication_token : null;
            config.headers['Authentication-Token'] = token;
            return config;
        };

        function responseError(response) {
            if (response.status == 401) {
                $window.location.href = '#/bioboxgui/login'
            }
            return $q.reject(response);
        };
    };
})();
