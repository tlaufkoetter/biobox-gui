(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('BioboxController', BioboxController);

    function BioboxController(bioboxService, $location, interfaces, bioboxes) {
        var vm = this;

        vm.interfaces = interfaces;
        vm.bioboxes = bioboxes;

        vm.addSource = addSource;
        vm.getBioboxes = getBioboxes;
        vm.getBiobox = getBiobox;
        vm.updateBioboxes = updateBioboxes;
        vm.getInterfaces = getInterfaces;
        vm.getInterface = getInterface;
        vm.selectBiobox = selectBiobox;
        vm.selectTask = selectTask;
        vm.submitTask = submitTask;
        vm.deleteTask = deleteTask;
        vm.queryStates = queryStates;

        function addSource(source) {
            bioboxService.addSource(source).then(
                function success(response) {
                    updateBioboxes();
                },
                function failure(response) {
                    vm.bioboxes = 'fail';
                }
            );
        };

        function getBioboxes() {
            bioboxService.getBioboxes().then(
                function success(response) {
                    console.log(response);
                    vm.bioboxes = response.data;
                },
                function failure(response) {
                    vm.bioboxes = 'fail';
                });
        };

        function getBiobox(pmid) {
            vm.task = null;
            bioboxService.getBiobox(pmid)
                .then(
                    function success(response) {
                        console.log(response);
                        vm.biobox = response.data;
                    },
                    function failure(response) {
                        console.log(response);
                        vm.biobox = response.status;
                    }
                );
        }

        function updateBioboxes() {
            bioboxService.updateBioboxes()
                .then(
                    function success(response) {
                        vm.bioboxes = response.data;
                    },
                    function failure(response) {
                        vm.bioboxes = 'fail';
                    }
                )
            ;
            vm.getInterfaces();
        };

        function getInterfaces() {
            bioboxService.getInterfaces()
                .then(
                    function success(response) {
                        console.log(response);
                        vm.interfaces = response.data;
                    },
                    function failure(response) {
                        vm.interfaces = response.status;
                    });
        };

        function getInterface(selectedInterface) {
            if (selectedInterface !== null) {
                vm.interface = selectedInterface;
                bioboxService.getInterface(selectedInterface.name)
                    .then(
                        function success(response) {
                            vm.bioboxes = response.data;
                        },
                        function failure(response) {
                            vm.bioboxes = null;
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
                    function success(response) {
                        console.log(response);
                    },
                    function failure(response) {
                        console.log(response);
                    }
                );
        };

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
    };
})();