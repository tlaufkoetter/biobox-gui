(function() {
    'use strict';

    angular
        .module('BioboxGui')
        .constant('Constants', {
            Roles: {
                admin: 'admin',
                trusted: 'trusted',
                base: 'base',
                user: 'user'
            }
        });
})();
