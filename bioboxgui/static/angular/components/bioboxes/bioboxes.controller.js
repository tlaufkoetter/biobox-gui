(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('BioboxController', BioboxController);

    /**
     * handles actions in relation to bioboxes.
     *
     * @param bioboxes prefetched when routing
     * @param interfaces prefetched when routing
     */
    function BioboxController(bioboxes, interfaces, bioboxService, Constants, Notification, $location, $route, $rootScope) {
        var vm = this;

        // pre fetched model data
        vm.interfaces = interfaces;
        vm.bioboxes = bioboxes;

        // exposed methods
        vm.getBioboxes = getBioboxes;
        vm.getBiobox = getBiobox;
        vm.updateBioboxes = updateBioboxes;
        vm.getInterfaces = getInterfaces;
        vm.getInterface = getInterface;
        vm.selectBiobox = selectBiobox;
        vm.selectTask = selectTask;
        vm.submitTask = submitTask;

        // available roles
        vm.Roles = Constants.Roles;

        // available input files to be used by bioboxes
        vm.files = [];

        /**
         * queries all the bioboxes.
         */
        function getBioboxes() {
            bioboxService.getBioboxes()
                .then(
                    function(bioboxes) {
                        vm.bioboxes = bioboxes;
                    },
                    function(error) {
                        vm.bioboxes = [];
                        Notification.error({
                            title: "Fetching Bioboxes failed",
                            message: error.message
                        });
                    }
                );
        }

        /**
         * queries a biobox with the given PMID.
         */
        function getBiobox(pmid) {
            vm.task = null;
            bioboxService.getBiobox(pmid)
                .then(
                    function(biobox) {
                        vm.biobox = biobox;
                    },
                    function(error) {
                        vm.biobox = null;
                        var message;
                        switch(error.status_code) {
                            case 404:
                                message = "This biobox does not exist.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            title: "Fetching Biobox failed",
                            message: message
                        });
                    }
                );
        }

        /**
         * updates the biobox list.
         */
        function updateBioboxes() {
            bioboxService.updateBioboxes()
                .then(
                    function(bioboxes) {
                        vm.bioboxes = bioboxes;
                        Notification.info("Updatet biobox list");
                    },
                    function(error) {
                        vm.bioboxes = null;
                        Notification.error({
                            title: "Updating bioboxes failed.",
                            message: error.message
                        });
                    }
                )
            ;
            vm.getInterfaces();
        }

        /**
         * queries the list of implementd interfaces.
         */
        function getInterfaces() {
            bioboxService.getInterfaces()
                .then(
                    function(interfaces) {
                        vm.interfaces = interfaces;
                        Notification.info("Updated interface list.");
                    },
                    function(error) {
                        vm.interfaces = [];
                        Notification.error({
                            title: "Updating interfaces failed.",
                            message: error.message
                        });
                    });
        }

        /**
         * queries the list of bioboxes with the given interface.
         */
        function getInterface(selectedInterface) {
            if (selectedInterface !== null) {
                vm.interface = selectedInterface;
                bioboxService.getInterface(selectedInterface.name)
                    .then(
                        function(bioboxes) {
                            vm.bioboxes = bioboxes;
                        },
                        function(error) {
                            vm.bioboxes = [];
                            var message;
                            switch(error.status_code) {
                                case 404:
                                    message = "The interface doesn't exist";
                                    break;
                                default:
                                    message = error.message;
                            }
                            Notification.error({
                                title: "Selecting interface failed",
                                message: message
                            });
                        });
            } else {
                getBioboxes();
            }
        }

        /**
         * sets the given biobox as the displayed biobox.
         */
        function selectBiobox(biobox) {
            vm.biobox = biobox;
            vm.task = null;
        }

        /**
         * selects a task of a biobox to be executed.
         */
        function selectTask(selectedTask) {
            if ($rootScope.isAuthenticated()) {
                bioboxService.getFiles()
                .then(
                    function(files) {
                        vm.files = files;
                        if (selectedTask !== null) {
                            vm.task = selectedTask;
                        }
                    },
                    function(error) {
                        Notification.error({
                                message: error.message
                        });
                    }
                );
            }
        }

        /**
         * submits the currently selected task.
         */
        function submitTask() {
            bioboxService.submitTask('test', vm.biobox.image.dockerhub, vm.task.name, vm.task.file)
                .then(
                    function() {
                        Notification.info("Task submitted.");
                        $route.reload();
                    },
                    function(error) {
                        var message;
                        switch(error.status_code) {
                            case 400:
                                message = "Please check your input file.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            title: "Submitting task failed",
                            message: message
                        });
                    }
                );
        }
    }
})();
