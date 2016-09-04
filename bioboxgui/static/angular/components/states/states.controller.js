(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('StateController', StateController);

    function StateController(stateService, states, Notification) {
        var vm = this;

        vm.states = states;
        vm.deleteTask = deleteTask;
        vm.queryStates = queryStates;

        function deleteTask(id) {
            stateService.deleteTask(id)
                .then(
                    function(response) {
                        queryStates();
                    },
                    function(reponse) {
                        console.log(response);
                    }
                );
        };

        function queryStates() {
            resolveStatePromise(stateService.queryStates());
        };

        function resolveStatePromise(promise) {
            promise
                .then(
                    function(states) {
                        vm.states = states;
                    },
                    function(status_code) {
                        var message;
                        switch(status_code) {
                            case 401:
                                message = "You're not logged in.";
                                break;
                            case 403:
                                message = "You're not allowed to do that";
                                break;
                            case 404:
                                message = "No states found";
                                break;
                            default:
                                message = "Something went wrong: " + status_code;
                        }
                        Notification.error({
                            message: message,
                            title: "Failed to fetch states"
                        });
                    }
                );
        }
    }
})();
