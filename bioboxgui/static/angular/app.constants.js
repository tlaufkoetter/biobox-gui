(function() {
    'use strict';

    // creates constants for the module.
    angular
        .module('BioboxGui')
        .constant('Constants', {
            // webapp roles on the right
            // application roles on the left
            Roles: {
                admin: 'admin',
                trusted: 'trusted',
                base: 'base',
                common: 'common'
            },
            // basic API information
            Api: {
                version: 'v1',
                baseURL: '/bioboxgui/api/'
            }
        });
})();
