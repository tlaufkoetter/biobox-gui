(function() {
    'use strict';

    angular
        .module('BioboxGui')
        .constant('Constants', Constants);

    function Constants() {
        var vm = this;
        vm.Roles = {
            admin: 'admin',
            trusted: 'trusted',
            user: 'user'
        };
    }
})();

