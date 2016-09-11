(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('BioboxController', BioboxController);

    function BioboxController(bioboxService, $location, interfaces, bioboxes, Notification, $route, Constants) {
        var vm = this;

        vm.interfaces = interfaces;
        vm.bioboxes = bioboxes;

        vm.getBioboxes = getBioboxes;
        vm.getBiobox = getBiobox;
        vm.updateBioboxes = updateBioboxes;
        vm.getInterfaces = getInterfaces;
        vm.getInterface = getInterface;
        vm.selectBiobox = selectBiobox;
        vm.selectTask = selectTask;
        vm.submitTask = submitTask;
        vm.Roles = Constants.Roles;

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
        };

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
        };

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
        };

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
        };

        function selectBiobox(biobox) {
            vm.biobox = biobox;
        };

        function selectTask(selectedTask) {
            if (selectedTask !== null) {
                vm.task = selectedTask;
            }
        };

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
        };

    };
})();
