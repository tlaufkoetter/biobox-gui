(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .factory('bioboxService', bioboxService);

    /**
     * service to communicate with the REST API an handle bioboxes.
     */
    function bioboxService(gatewayService, $log, $q) {
        // exposed methods.
        var service = {
            getBiobox: getBiobox,
            getBioboxes: getBioboxes,
            updateBioboxes: updateBioboxes,
            getInterface: getInterface,
            getInterfaces: getInterfaces,
            submitTask: submitTask,
            getFiles: getFiles
        };
        return service;

        /**
         * queries all the bioboxes.
         */
        function getBioboxes() {
            return gatewayService.get('/bioboxes')
                .then(
                    function(response) {
                        var bioboxes = response.data.bioboxes;
                        $log.info("fetched bioboxes: ", bioboxes);
                        return bioboxes;
                    },
                    function(response) {
                        $log.warn("fetching bioboxes failed");
                        return $q.reject(response);
                    }
                );
        }

        /**
         * queries a biobox with the given id.
         */
        function getBiobox(id) {
            return gatewayService.get('bioboxgui/api/bioboxes/' + id)
                .then(
                    function(response){
                        var biobox = response.data.biobox;
                        $log.info("fetched biobox: ", biobox);
                        return biobox;
                    },
                    function(response){
                        $log.warn("failed to fetch biobox");
                        return $q.reject(response);
                    }
                );
        }

        /**
         * updates the bioboxes.
         */
        function updateBioboxes() {
            return gatewayService.put('/bioboxes')
                .then(
                    function(response){
                        var bioboxes = response.data.bioboxes;
                        $log.info("updated bioboxes: ", bioboxes);
                        return bioboxes;
                    },
                    function(response){
                        $log.warn("failed to update bioboxes");
                        return $q.reject(response);
                    }
                );

        }

        /**
         * queries a list of interfaces that are implemented by bioboxes.
         */
        function getInterfaces() {
            return gatewayService.get('/interfaces')
                .then(
                    function(response){
                        var interfaces = response.data.interfaces;
                        $log.info("fetched interfaces: ", interfaces);
                        return interfaces;
                    },
                    function(response){
                        $log.warn("failed to fetch interface");
                        return $q.reject(response);
                    }
                );

        }

        /**
         * queries a list of bioboxes that implement this interface.
         */
        function getInterface(selectedInterface) {
            return gatewayService.get('/bioboxes?interface=' + selectedInterface)
                .then(
                    function(response){
                        var bb_interface = response.data.bioboxes;
                        $log.info("fetched bb_interface: ", bb_interface);
                        return bb_interface;
                    },
                    function(response){
                        $log.warn("failed to fetch interface", selectedInterface);
                        return $q.reject(response);
                    }
                );

        }

        /**
         * submits the task with the given parameters.
         *
         * @param user the user that submits the task
         * @param container the biobox to be used
         * @param cmd the task the container shall execute
         * @param file the file the container reads from
         */
        function submitTask(user, container, cmd, file) {
            var task = {};
            task.user = user;
            task.container = container;
            task.cmd = cmd;
            task.file = file[0].name;
            return gatewayService.post('/tasks', task)
                .then(
                    function(response){
                        $log.info("submitted task");
                    },
                    function(response){
                        $log.warn("failed to submit task: ", user, container, cmd, file);
                        return $q.reject(response);
                    }
                );

        }

        /**
         * queries a list of the available input files.
         */
        function getFiles() {
            return gatewayService.get('/files')
                .then(
                        function(response) {
                            $log.info("fetched files: ", response.data.files);
                            return response.data.files;
                        },
                        function(response) {
                            $log.warn("failed to fetch files");
                            return $q.reject(response);
                        }
                    );
        }
    }
})();
