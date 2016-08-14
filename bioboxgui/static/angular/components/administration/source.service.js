(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('sourceService', sourceService);

    function sourceService($http) {
        var service = {
            addSource: addSource,
            deleteSource: deleteSource
        };
        return service;

        function deleteSource(url) {
        }

        function addSource(source) {
            return $http.post('/bioboxgui/api/sources', source)
        }
    }
})();
