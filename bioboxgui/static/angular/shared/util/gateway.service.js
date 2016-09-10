(function() {
    'use strict';

    angular
        .module("BioboxGui")
        .factory("gatewayService", gatewayService);

    function gatewayService($http, $q, $log) {
        var service = {
            get: get,
            put: put,
            post: post,
            delete: deletem
        };
        return service;

        function get(url) {
            return $http.get(url)
                .then(
                    success,
                    error
                );
        }

        function put(url, data) {
            return $http.put(url, data)
                .then(
                    success,
                    error
                );
        }

        function post(url, data) {
            return $http.post(url, data)
                .then(
                    success,
                    error
                );
        }

        function deletem(url) {
            return $http.delete(url)
                .then(
                    success,
                    error
                );
        }

        function success(response) {
            return response;
        }

        function error(response) {
            $log.warn('Error from server: ', response);
            var message;
            switch (response.status) {
                case 400:
                    message = "Check your input.";
                    break;
                case 401:
                    message = "You are not logged in.";
                    break;
                case 403:
                    message = "You are not allowed to do that.";
                    break;
                case 404:
                    message = "The requested resource does not exist.";
                    break;
                case 502:
                    message =
                        "The scheduler proxy could not "
                        + "be reached or had an error.";
                    break;
                default:
                    message = "something went wrong";
            }
            return $q.reject({
                status_code: response.status,
                message: message
            });
        }
    }
})();
