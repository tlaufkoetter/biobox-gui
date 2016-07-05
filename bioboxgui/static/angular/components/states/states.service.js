(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('stateService', stateService);

    function stateService($http) {
        var service = {
            queryStates: queryStates,
            deleteTask: deleteTask
        };
        return service;

        function queryStates() {
            return $http.get('/bioboxgui/api/tasks');
        };

        function deleteTask(id) {
            return $http.delete('/bioboxgui/api/tasks/' + id);
        };
    }

})();