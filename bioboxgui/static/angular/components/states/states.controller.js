(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('StateController', StateController);

    /**
     * controller manages the states of submitted tasks.
     *
     * @param states prefetched while routing
     */
    function StateController(states, stateService, Constants, Notification, $route) {
        var vm = this;

        // exposed methods
        vm.states = states;
        vm.deleteTask = deleteTask;
        vm.queryStates = queryStates;

        // available roles
        vm.Roles = Constants.Roles;

        /**
         * deletes the task with the given id,
         * kills it when it is still running
         */
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

        /**
         * queries a list of all the running tasks.
         */
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
