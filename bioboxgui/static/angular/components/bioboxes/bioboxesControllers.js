'use strict';

var BioboxController = function (BioboxService, TaskService, $routeParams, $location) {
    this.bioboxService = BioboxService;
    this.taskService = TaskService;
    this.pmid = $routeParams.pmid;
    this.$location = $location;
    if (this.pmid) {
        this.getBiobox(this.pmid);
    }
    this.getInterfaces();
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

BioboxController.prototype.getBiobox = function (pmid) {
    var _this = this;
    _this.task = null;
    _this.bioboxService.getBiobox(pmid)
        .then(
            function success(response) {
                console.log(response);
                _this.biobox = response.data;
            },
            function failure(response) {
                console.log(response);
                _this.biobox = response.status;
            }
        );
}

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
                _this.interfaces = response.status;
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

BioboxController.prototype.selectBiobox = function (pmid) {
    this.$location.url('bioboxgui/bioboxes/' + pmid);
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

BioboxController.prototype.deleteTask = function (id) {
    var _this = this;
    _this.taskService.deleteTask(id)
        .then(
            function success(response) {
                console.log(response);
                _this.queryStates();
            },
            function failure(reponse) {
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
                _this.states = response.data.states;
            },
            function failure(response) {
                console.log(response);
            }
        );
};

app.controller('BioboxController', BioboxController);