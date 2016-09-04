(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('bioboxService', bioboxService);

    function bioboxService($http, $log, $q) {
        var service = {
            getBiobox: getBiobox,
            getBioboxes: getBioboxes,
            updateBioboxes: updateBioboxes,
            getInterface: getInterface,
            getInterfaces: getInterfaces,
            submitTask: submitTask
        };
        return service;


        function getBioboxes() {
            return $http.get('/bioboxgui/api/bioboxes')
                .then(
                        function(response) {
                            var bioboxes = response.data.bioboxes;
                            $log.info("fetched bioboxes: ", bioboxes);
                            return bioboxes;
                        },
                        function(response) {
                            $log.warn("fetching bioboxes failed: ", reponse);
                            return $q.reject(response.status);
                        }
                     );
        }

        function getBiobox(id) {
            return $http.get('bioboxgui/api/bioboxes/' + id)
                .then(
                        function(response){
                            var biobox = response.data.biobox;
                            $log.info("fetched biobox: ", biobox);
                            return biobox;
                        },
                        function(response){
                            $log.warn("failed to fetch biobox: ", id, response);
                            return $q.reject(response.status);
                        }
                     );
        }

        function updateBioboxes() {
            return $http.put('/bioboxgui/api/bioboxes')
                .then(
                        function(response){
                            var bioboxes = response.data.bioboxes;
                            $log.info("updated bioboxes: ", bioboxes);
                            return bioboxes;
                        },
                        function(response){
                            $log.warn("failed to update bioboxes: ", response);
                            return $q.reject(response.status);
                        }
                     );

        }

        function getInterfaces() {
            return $http.get('/bioboxgui/api/interfaces')
                .then(
                        function(response){
                            var interfaces = response.data.interfaces;
                            $log.info("fetched interfaces: ", interfaces);
                            return interfaces;
                        },
                        function(response){
                            $log.warn("failed to fetch interface: ", response);
                            return $q.reject(response.status);
                        }
                     );

        }

        function getInterface(selectedInterface) {
            return $http.get('/bioboxgui/api/bioboxes?interface=' + selectedInterface)
                .then(
                        function(response){
                            var bb_interface = response.data.bb_interface;
                            $log.info("fetched bb_interface: ", bb_interface);
                            return bb_interface;
                        },
                        function(response){
                            $log.warn("failed to fetch interface: ", selectedInterface, response);
                            return $q.reject(response.status);
                        }
                     );

        }

        function submitTask(user, container, cmd, file) {
            var task = {};
            task.user = user;
            task.container = container;
            task.cmd = cmd;
            task.file = file;
            return $http.post('/bioboxgui/api/tasks', task)
                .then(
                        function(response){
                            $log.info("submitted task");
                        },
                        function(response){
                            $log.warn("failed to submit task: ", user, container, cmd, file, response);
                            return $q.reject(response.status);
                        }
                     );

        }
    }
})();
