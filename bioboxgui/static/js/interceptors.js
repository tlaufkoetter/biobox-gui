'use strict';

var app = angular.module('BioboxGui'),

    ResponseInterceptor = function ($window, $q) {
        var interceptor = {
            responseError: function (response) {
                if (response.status == 401) {
                    $window.location.href = '#/bioboxgui/login'
                }
                return $q.reject(response);
            }
        }
        return interceptor;
    };

app.factory('responseInterceptor', ResponseInterceptor);
