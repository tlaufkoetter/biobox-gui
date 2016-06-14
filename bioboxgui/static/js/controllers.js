'use strict';

var app = angular.module('BioboxGui'),

    BioboxController = function (BioboxService, TaskService) {
        this.bioboxService = BioboxService;
        this.taskService = TaskService;
        this.biobox = null;
        this.task = null;
        this.interface = null;
        this.getInterfaces();
    },

    LoginController = function (UserService, $http, $window) {
        this.userService = UserService;
        this.$http = $http;
        this.$window = $window;
        this.user = {};

    },

    RegisterController = function (UserService, $location) {
        this.userService = UserService;
        this.$location = $location;
        this.user = {};
    };

BioboxController.prototype.addSource = function (source) {
    var _this = this;
    _this.bioboxService.addSource(source).then(
        function success(response) {
            _this.updateBioboxes();
        },
        function failure(response) {
            _this.bioboxes = 'fail';
        }
    );
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
        _this.interface = selectedInterface;
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
        _this.task = null;
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

BioboxController.prototype.selectTask = function (selectedTask) {
    var _this = this;
    if (selectedTask !== null) {
        _this.task = selectedTask;
    }
};

BioboxController.prototype.submitTask = function () {
    var _this = this;
    _this.taskService.submitTask('test', _this.biobox.image.dockerhub, _this.task.name, _this.task.file)
        .then(
            function success(response) {
                console.log(response);
            },
            function failure(response) {
                console.log(response);
            }
        );
};


BioboxController.prototype.queryStates = function () {
    var _this = this;
    _this.taskService.queryStates()
        .then(
            function success(response) {
                console.log(response);
            },
            function failure(response) {
                console.log(response);
            }
        );
};

RegisterController.prototype.createUser = function () {
    var _this = this;
    if (_this.user !== {}) {
        _this.userService.createUser(_this.user)
            .then(
                function success(response) {
                    _this.$location.path('/bioboxgui/login');
                },

                function failure(response) {
                }
            );
    }
};

LoginController.prototype.login = function () {
    var _this = this;
    if (_this.user !== {}) {
        _this.userService.login(_this.user)
            .then(
                function success(response) {
                    if (response.data.response) {
                        _this.$http.defaults.headers.common['Authentication-Token'] = response.data.response.user.authentication_token;
                    }
                    _this.$window.location.href = '#/bioboxgui';
                },
                function failure(response) {
                    console.log('what now');
                }
            )
    }
};

app.controller('BioboxController', BioboxController);
app.controller('LoginController', LoginController);
app.controller('RegisterController', RegisterController);


