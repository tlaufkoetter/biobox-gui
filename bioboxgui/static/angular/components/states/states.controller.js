(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('StateController', StateController);

    function StateController(stateService, states, Notification, $route, Constants) {
        var vm = this;

        vm.states = states;
        vm.deleteTask = deleteTask;
        vm.queryStates = queryStates;
        vm.Roles = Constants.Roles;

        function deleteTask(id) {
            stateService.deleteTask(id)
                .then(
                    function() {
                        $route.reload();
                        queryStates();
                    },
                    function(error) {
                        var message;
                        switch(error.status_code) {
                            case 404:
                                message = "The task does not exist.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            "title": "Failed to delete task " + id,
                            "message": message
                        });
                    }
                );
        };

        function queryStates() {
            stateService.queryStates()
                .then(
                    function(states) {
                        vm.states = states;
                    },
                    function(error) {
                        var message;
                        switch(error.status_code) {
                            case 404:
                                message = "No states found";
                                break;
                            default:
                                message = error.message;
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
