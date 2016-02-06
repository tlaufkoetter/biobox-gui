(function () {
    var app = angular.module('BioboxGui');

    var BioboxService = function ($http) {
        this.$http = $http;
    };

    BioboxService.prototype.getBioboxes = function () {
        return this.$http.get('/bioboxgui/api/bioboxes');
    };

    BioboxService.prototype.updateBioboxes = function () {
        return this.$http.get('/bioboxgui/api/bioboxes/update');
    };

    BioboxService.prototype.getInterfaces = function () {
        return this.$http.get('/bioboxgui/api/bioboxes/interfaces');
    };

    BioboxService.prototype.getInterface = function (selectedInterface) {
        return this.$http.get('/bioboxgui/api/bioboxes/interfaces/' + selectedInterface);
    };

    BioboxService.$inject = ['$http'];

    app.service('bioboxService', BioboxService);
}());