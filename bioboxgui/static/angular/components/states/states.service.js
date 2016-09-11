(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('stateService', stateService);

    /**
     * service manages the states of submitted tasks.
     */
    function stateService(gatewayService, $log, $q) {
        // exposed methods
        var service = {
            queryStates: queryStates,
            deleteTask: deleteTask
        };
        return service;

        /**
         * queries a list of the states of all the submitted tasks.
         */
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

        /**
         * deletes the task with the given id,
         * kills it if it's still running.
         */
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
