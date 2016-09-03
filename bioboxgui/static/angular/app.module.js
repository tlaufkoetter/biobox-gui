(function () {
    'use strict';

    angular
        .module('BioboxGui', ['ngRoute', 'angular-storage', 'ui-notification'])
        .config(configure);

    function configure(NotificationProvider) {
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
