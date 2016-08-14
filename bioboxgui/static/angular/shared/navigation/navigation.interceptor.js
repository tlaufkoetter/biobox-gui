(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('responseInterceptor', responseInterceptor);

    function responseInterceptor($window, $q, sessionService) {
        var interceptor = {
            request: request,
            responseError: responseError
        };
        return interceptor;

        function request(config) {
            var currentUser = sessionService.getCurrentUser(),
                token = currentUser ? currentUser.authentication_token : null;
            config.headers['Authorization'] = 'Bearer ' + token;
            return config;
        };

        function responseError(response) {
            if (response.status == 401) {
                $window.location.href = '#/bioboxgui/login';
            }
            return $q.reject(response);
        };
    };
})();
