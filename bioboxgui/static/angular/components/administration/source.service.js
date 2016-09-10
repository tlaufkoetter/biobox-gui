(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('sourceService', sourceService);

    function sourceService(gatewayService, $log, $q) {
        var service = {
            addSource: addSource,
            deleteSource: deleteSource
        };
        return service;

        function deleteSource(name) {
            return gatewayService.delete('/sources/' + name)
                .then(
                    function(response) {
                        $log.info('Deleted source: ', name);
                    },
                    function(response) {
                        $log.warn('Failed to delete source');
                        return $q.reject(response);
                    }
                );
        }

        function addSource(source) {
            return gatewayService.post('/sources', source)
                .then(
                    function(response) {
                        $log.info('Added new source: ', source);
                    },
                    function(response) {
                        $log.warn('Failed to add new source');
                        return $q.reject(response);
                    }
                );
        }
    }
})();
