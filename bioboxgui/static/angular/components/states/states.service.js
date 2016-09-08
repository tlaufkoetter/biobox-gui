(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('stateService', stateService);

    function stateService($http, $log, $q) {
        var service = {
            queryStates: queryStates,
            deleteTask: deleteTask
        };
        return service;

        function queryStates() {
            return $http.get('/bioboxgui/api/tasks')
                .then(
                        function(response) {
                            $log.info("queried states: ", response.data.states);
                            return response.data.states;
                        },
                        function(response) {
                            $log.warn("failed to query states: ", response);
                            return $q.reject(response.status);
                        }
                     );
        };

        function deleteTask(id) {
            return $http.delete('/bioboxgui/api/tasks/' + id)
                .then(
                        function(response) {
                            $log.info("deleted task " + id);
                            return;
                        },
                        function(response) {
                            $log.warn("failed to delete task: ", response);
                            return $q.reject(response.status);
                        }
                     );
        };
    }

})();
