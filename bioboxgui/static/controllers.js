(function () {
    'use strict';
    var app = angular.module('BioboxGui', ['ngResource']),

        BioboxController = function (bioboxService) {
            this.bioboxService = bioboxService;
            this.biobox = null;
            this.getInterfaces();
        };

    BioboxController.prototype.getBioboxes = function () {
        var _this = this;
        _this.bioboxService.getBioboxes().then(
            function success(response) {
                console.log(response);
                _this.bioboxes = response.data.bioboxes;
            },
            function failure(response) {
                _this.bioboxes = 'fail';
            });
    };

    BioboxController.prototype.updateBioboxes = function () {
        var _this = this;
        _this.bioboxService.updateBioboxes()
            .then(
                function success(response) {
                    _this.bioboxes = response.data.bioboxes;
                },
                function failure(response) {
                    _this.bioboxes = 'fail';
                }
            )
        ;
        _this.getInterfaces();
    };

    BioboxController.prototype.getInterfaces = function () {
        var _this = this;
        _this.bioboxService.getInterfaces()
            .then(
                function success(response) {
                    console.log(response);
                    _this.interfaces = response.data.interfaces;
                },
                function failure(response) {
                    _this.interfaces = null;
                });
    };

    BioboxController.prototype.getInterface = function (selectedInterface) {
        var _this = this;
        if (selectedInterface !== null) {
            _this.bioboxService.getInterface(selectedInterface.name)
                .then(
                    function success(response) {
                        _this.bioboxes = response.data.bioboxes;
                    },
                    function failure(response) {
                        _this.bioboxes = null;
                    });
        } else {
            _this.getBioboxes();
        }
    };

    BioboxController.prototype.selectBiobox = function (selectedBiobox) {
        var _this = this;
        if (selectedBiobox !== null) {
            _this.bioboxService.getBiobox(selectedBiobox.pmid)
                .then(
                    function success(response) {
                        console.log(response);
                        _this.biobox = response.data.biobox;
                    },
                    function failure(response) {
                        console.log(response);
                        _this.biobox = 'fail';
                    }
                );
        }
    };


    BioboxController.$inject = ['bioboxService'];

    app.controller('BioboxController', BioboxController);
}());
