(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('StateController', StateController);

    function StateController(stateService, states) {
        var vm = this;

        vm.states = states;
        vm.deleteTask = deleteTask;
        vm.queryStates = queryStates;

        function deleteTask(id) {
            bioboxService.deleteTask(id)
                .then(
                    function success(response) {
                        console.log(response);
                        queryStates();
                    },
                    function failure(reponse) {
                        console.log(response);
                    }
                );
        };

        function queryStates() {
            bioboxService.queryStates()
                .then(
                    function success(response) {
                        console.log(response);
                        vm.states = response.data.states;
                    },
                    function failure(response) {
                        console.log(response);
                    }
                );
        };
    }
})();
