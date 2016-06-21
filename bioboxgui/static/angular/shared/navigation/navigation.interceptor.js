(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('responseInterceptor', responseInterceptor);

    function responseInterceptor($window, $q) {
        var interceptor = {
            responseError: responseError
        }
        return interceptor;

        function responseError(response) {
            if (response.status == 401) {
                $window.location.href = '#/bioboxgui/login'
            }
            return $q.reject(response);
        };
    };
})();
