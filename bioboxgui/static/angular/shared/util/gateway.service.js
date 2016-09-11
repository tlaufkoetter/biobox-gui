(function() {
    'use strict';

    angular
        .module("BioboxGui")
        .factory("gatewayService", gatewayService);

    /**
     * service that serves as gateway in an attempt to streamline API calls.
     *
     * exposes the basic http REST methods to the basURL of the REST API.
     * default error handling and message generation.
     */
    function gatewayService(Constants, $http, $q, $log) {
        // exposed methods
        var service = {
                get: get,
                put: put,
                post: post,
                delete: deletem
            },
            // the base url for the REST API
            baseURL = Constants.Api.baseURL + Constants.Api.version;
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

        /**
         * passing through a success response.
         */
        function success(response) {
            return response;
        }

        /**
         * handling error responses with a log message and
         * returning a default error message to be used by controllers.
         */
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
