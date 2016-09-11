(function () {
    'use strict';

    angular
        .module('BioboxGui', ['ngRoute', 'angular-storage', 'ui-notification', 'isteven-multi-select'])
        .config(configure);

    /**
     * configures the module.
     */
    function configure(NotificationProvider) {
        // configures the Notifications
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    }
})();
