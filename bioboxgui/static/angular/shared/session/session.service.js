(function () {
    'use strict';

    angular
        .module('BioboxGui')
        .service('sessionService', sessionService);

    /**
     * handles the user session.
     */
    function sessionService(store, $rootScope) {
        // exposed methods
        var service = {
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser,
            },
            // the currently logged in user
            currentUser = null;

        // global functions
        $rootScope.isAuthenticated = isAuthenticated;
        $rootScope.hasRole = hasRole;
        $rootScope.hasUserRole = hasUserRole;

        return service;

        /**
         * loads the current user.
         */
        function getCurrentUser() {
            if (!currentUser) {
                currentUser = store.get('user');
            }
            return currentUser;
        };

        /**
         * sets the given user as the currently logged in user.
         */
        function setCurrentUser(user) {
            currentUser = user;
            store.set('user', user);
            return currentUser;
        }

        /**
         * determines whether the current user is authenticated.
         */
        function isAuthenticated() {
            return currentUser !== null && currentUser;
        }

        /**
         * determines whether the current user has any of the given roles.
         */
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

        /**
         * determies whether the given user has any of the given roles.
         */
        function hasUserRole(user, roles) {
            var hasRole = false;
            roles.forEach(function(role) {
                hasRole |= user.roles.indexOf(role) > -1;
            });
            return hasRole;
        }
    };
})();

