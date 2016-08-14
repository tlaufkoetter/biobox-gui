(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .service('sessionService', sessionService);

    function sessionService(store) {
        var service = {
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser
            },
            currentUser = null;
        return service;

        function getCurrentUser() {
            if (!currentUser) {
                currentUser = store.get('user');
            }
            return currentUser;
        };

        function setCurrentUser(user) {
            currentUser = user;
            store.set('user', user);
            return currentUser;
        }
    };
})();

