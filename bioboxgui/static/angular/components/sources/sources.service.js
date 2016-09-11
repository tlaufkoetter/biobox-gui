(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('sourceService', sourceService);

    function sourceService(gatewayService, $log, $q) {
        var service = {
            getSource: getSource,
            getSources: getSources,
            addSource: addSource,
            deleteSource: deleteSource
        };
        return service;

        function getSource(sourcename) {
            return gatewayService.get('/sources/' + sourcename)
                .then(
                        function(response) {
                            $log.info('get source: ', response.data.source);
                            return response.data.source;
                        },
                        function(response) {
                            $log.warn('failed to get source');
                            return $q.reject(response);
                        }
                    );
        }

        function getSources() {
            return gatewayService.get('/sources')
                .then(
                        function(response) {
                            $log.info('get sources: ', response.data.sources);
                            return response.data.sources;
                        },
                        function(response) {
                            $log.warn('failed to get sources');
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
    }
})();
