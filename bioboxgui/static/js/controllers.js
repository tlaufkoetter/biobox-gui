'use strict';

var app = angular.module('BioboxGui'),

    BioboxController = function (BioboxService) {
        this.bioboxService = BioboxService;
        this.biobox = null;
        this.getInterfaces();
    },

    LoginController = function () {

    },

    RegisterController = function (UserService, $location) {
        this.userService = UserService;
        this.$location = $location;
        this.user = {};
    };


BioboxController.prototype.getBioboxes = function () {
    var _this = this;
    _this.bioboxService.getBioboxes().then(
        function success(response) {
            console.log(response);
            _this.bioboxes = response.data;
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
                _this.bioboxes = response.data;
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
                _this.interfaces = response.data;
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
                    _this.bioboxes = response.data;
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
                    _this.biobox = response.data;
                },
                function failure(response) {
                    console.log(response);
                    _this.biobox = 'fail';
                }
            );
    }
};

RegisterController.prototype.createUser = function () {
    var _this = this;
    if (this.user !== {}) {
        _this.userService.createUser(this.user)
            .then(
                function success(response) {
                    _this.$location.path('/bioboxgui/login');
                },

                function failure(response) {
                }
            );
    }
};

app.controller('BioboxController', BioboxController);
app.controller('LoginController', LoginController);
app.controller('RegisterController', RegisterController);


