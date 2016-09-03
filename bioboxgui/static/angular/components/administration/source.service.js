(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('sourceService', sourceService);

    function sourceService($http, $log, $q) {
        var service = {
            addSource: addSource,
            deleteSource: deleteSource
        };
        return service;

        function deleteSource(url) {
        }

        function addSource(source) {
            return $http.post('/bioboxgui/api/sources', source)
                .then(
                        function(response) {
                            $log.info('Added new source: ', source);
                        },
                        function(response) {
                            $log.warn('Failed to add new source: ', response);
                            return $q.reject(response.status);
                        }
                     );
        }
    }
})();
