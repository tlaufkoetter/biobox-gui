(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .controller('SourceController', SourceController);

    function SourceController(sources, userService, sourceService, Notification, $route, Constants) {
        var vm = this;

        vm.getSource = getSource;
        vm.getSources = getSources;
        vm.addSource = addSource;
        vm.deleteSource = deleteSource;

        vm.sources = sources;

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
