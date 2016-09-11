(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .service('sessionService', sessionService);

    function sessionService(store, $rootScope) {
        var service = {
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser,
            },
            currentUser = null;
        $rootScope.isAuthenticated = isAuthenticated;
        $rootScope.hasRole = hasRole;
        $rootScope.hasUserRole = hasUserRole;
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

        function isAuthenticated() {
            return currentUser !== null && currentUser;
        }

        function hasRole(roles) {
            var hasRole = false;
            if (isAuthenticated()) {
                var user = getCurrentUser();
                roles.forEach(function(role) {
                    hasRole |= user.roles.indexOf(role) > -1;
                });
            }
            return hasRole;
        }

        function hasUserRole(user, roles) {
            var hasRole = false;
            roles.forEach(function(role) {
                hasRole |= user.roles.indexOf(role) > -1;
            });
            return hasRole;
        }
    };
})();

