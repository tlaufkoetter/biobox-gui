(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('stateService', stateService);

    function stateService(gatewayService, $log, $q) {
        var service = {
            queryStates: queryStates,
            deleteTask: deleteTask
        };
        return service;

        function queryStates() {
            return gatewayService.get('/tasks')
                .then(
                        function(response) {
                            $log.info("queried states: ", response.data.states);
                            return response.data.states;
                        },
                        function(response) {
                            $log.warn("failed to query states");
                            return $q.reject(response);
                        }
                     );
        };

        function deleteTask(id) {
            return gatewayService.delete('/tasks/' + id)
                .then(
                        function(response) {
                            $log.info("deleted task " + id);
                            return;
                        },
                        function(response) {
                            $log.warn("failed to delete taski");
                            return $q.reject(response);
                        }
                     );
        };
    }

})();
