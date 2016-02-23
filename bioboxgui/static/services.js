(function () {
    'use strict';
    var app = angular.module('BioboxGui'),

        BioboxService = function ($http) {
            this.$http = $http;
        };

    BioboxService.prototype.getBioboxes = function () {
        return this.$http.get('/bioboxgui/api/bioboxes');
    };

    BioboxService.prototype.getBiobox = function (id) {
        return this.$http.get('bioboxgui/api/bioboxes/' + id);
    };

    BioboxService.prototype.updateBioboxes = function () {
        return this.$http.put('/bioboxgui/api/bioboxes');
    };

    BioboxService.prototype.getInterfaces = function () {
        return this.$http.get('/bioboxgui/api/interfaces');
    };

    BioboxService.prototype.getInterface = function (selectedInterface) {
        return this.$http.get('/bioboxgui/api/bioboxes?interface=' + selectedInterface);
    };

    BioboxService.$inject = ['$http'];

    app.service('bioboxService', BioboxService);
}());
