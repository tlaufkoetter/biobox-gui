(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('SourceController', SourceController);

    /**
     * controller handles the sources for bioboxes.
     *
     * @param sources prefetched while routin
     */
    function SourceController(sources, sourceService, Constants, Notification, $route) {
        var vm = this;

        // exposed methods
        vm.getSource = getSource;
        vm.getSources = getSources;
        vm.addSource = addSource;
        vm.deleteSource = deleteSource;

        // prefetched model data
        vm.sources = sources;

        /**
         * queries the source by its name.
         */
        function getSource(sourcename) {
            sourceService.getSource(sourcename)
                .then(
                        function(source) {
                            vm.selected_source = source;
                        },
                        function(error) {
                            var message;
                            switch (error.status_code) {
                                case 404:
                                    message = "Source doesn't exist.";
                                    break;
                                default:
                                    message = error.message;
                            }
                            Notification.error({
                                title: "Failed to get source",
                                message: message
                            });
                        }
                    );
        }

        /**
         * queries all the sources.
         */
        function getSources() {
            sourceService.getSources()
                .then(
                        function(sources) {
                            vm.sources = sources;
                        },
                        function(error) {
                            Notification.error({
                                title: "Failed to get sources",
                                message: error.message
                            });
                        }
                    );
        }

        /**
         * adds the given source to the sources list.
         */
        function addSource(source) {
            sourceService.addSource(source).then(
                function() {
                    Notification.success("Created new source");
                    $route.reload();
                },
                function(error) {
                    var message;
                    switch (error.status_code) {
                        case 400:
                            message = "The input is invalid. "
                                + "Maybe the source already exists "
                                + "or no valid source could be found at the given URL.";
                            break;
                        default:
                            message = error.message;
                    }
                    Notification.error({
                        title: "Adding source failed",
                        message: message
                    });
                }
            );
        }

        /**
         * deletes the given source and the bioboxes related to it.
         */
        function deleteSource(name) {
            sourceService.deleteSource(name)
                .then(
                    function() {
                        Notification.success("Deleted source");
                        $route.reload();
                    },
                    function(error) {
                        var message;
                        switch (error.status_code) {
                            case 404:
                                message = "The source doesn't exist.";
                                break;
                            default:
                                message = error.message;
                        }
                        Notification.error({
                            title: "Deleting source failed",
                            message: message
                        });
                    }
                );
        }
    }
})();
