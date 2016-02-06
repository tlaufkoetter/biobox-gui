(function () {
    var app = angular.module('BioboxGui', ['ngResource']);

    var BioboxController = function (bioboxService) {
        this.bioboxService = bioboxService;
        this.getInterfaces();
    };

    BioboxController.prototype.getBioboxes = function () {
        var _this = this;
        _this.bioboxService.getBioboxes().success(function (result) {
            _this.bioboxes = result.images;
        })
    };

    BioboxController.prototype.updateBioboxes = function () {
        var _this = this;
        _this.bioboxService.updateBioboxes().success(function (result) {
            _this.bioboxes = result.images;
        });
        _this.getInterfaces();
    };

    BioboxController.prototype.getInterfaces = function () {
        var _this = this;
        _this.bioboxService.getInterfaces().success(function (result) {
            _this.interfaces = result.interfaces;
        });
    };

    BioboxController.prototype.getInterface = function (selectedInterface) {
        var _this = this;
        if (selectedInterface !== null) {
            _this.bioboxService.getInterface(selectedInterface.name).success(function (result) {
                _this.bioboxes = result.images;
            });
        } else {
            _this.getBioboxes();
        }
    };


    BioboxController.$inject = ['bioboxService'];

    app.controller('BioboxController', BioboxController);
}());