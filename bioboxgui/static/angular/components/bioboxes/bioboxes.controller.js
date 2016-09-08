(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('BioboxController', BioboxController);

    function BioboxController(bioboxService, $location, interfaces, bioboxes, Notification. $route) {
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

        function getBioboxes() {
            bioboxService.getBioboxes()
                .then(
                        function(bioboxes) {
                            vm.bioboxes = bioboxes;
                        },
                        function(status_code) {
                            vm.bioboxes = [];
                            Notification.error({title: "Fetching Bioboxes failed", message: "Something went wrong"});
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
                        function(status_code) {
                            vm.biobox = null;
                            var message;
                            switch(status_code) {
                                case 404:
                                    message = "This biobox does not exist.";
                                    break;
                                default:
                                    message = "Something went wrong.";
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
                        function(status_code) {
                            vm.bioboxes = null;
                            Notification.error("Updating bioboxes failed.");
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
                        function(status_code) {
                            vm.interfaces = [];
                            Notification.error("Updating interfaces failed.");
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
                            function(status_code) {
                                vm.bioboxes = [];
                                var message;
                                switch(status_code) {
                                    case 404:
                                        message = "The interface doesn't exist";
                                        break;
                                    default:
                                        message = "Something went wrong";
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
                        function(status_code) {
                            var message;
                            switch(status_code) {
                                case 400:
                                    message = "Please check your input file.";
                                    break;
                                case 401:
                                    message = "You're not logged in";
                                    break;
                                case 403:
                                    message = "You're not allowed to do that";
                                    break;
                                default:
                                    message = "Something went wrong";
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
