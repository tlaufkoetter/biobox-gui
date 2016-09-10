(function() {
    'use strict';

    angular
        .module("BioboxGui")
        .factory("gatewayService", gatewayService);

    function gatewayService($http, $q, $log, Constants) {
        var service = {
            get: get,
            put: put,
            post: post,
            delete: deletem
        };
        var baseURL = Constants.Api.baseURL + Constants.Api.version;
        return service;


        function get(resource) {
            return $http.get(baseURL + resource)
                .then(
                    success,
                    error
                );
        }

        function put(resource, data) {
            return $http.put(baseURL + resource, data)
                .then(
                    success,
                    error
                );
        }

        function post(resource, data) {
            return $http.post(baseURL + resource, data)
                .then(
                    success,
                    error
                );
        }

        function deletem(resource) {
            return $http.delete(baseURL + resource)
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
