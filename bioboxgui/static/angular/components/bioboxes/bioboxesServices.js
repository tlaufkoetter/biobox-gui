'use strict';

var BioboxService = function ($http) {
        this.$http = $http;
    },

    TaskService = function ($http) {
        this.$http = $http;
    };

TaskService.prototype.submitTask = function (user, container, cmd, file) {
    var task = {};
    task.user = user;
    task.container = container;
    task.cmd = cmd;
    task.file = file;
    return this.$http.post('/bioboxgui/api/states', task);
};

BioboxService.prototype.addSource = function (source) {
    return this.$http.post('/bioboxgui/api/sources', source)
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

TaskService.prototype.queryStates = function () {
    return this.$http.get('/bioboxgui/api/states');
};

TaskService.prototype.deleteTask = function (id) {
    return this.$http.delete('/bioboxgui/api/states/' + id);
};

app.service('BioboxService', BioboxService);
app.service('TaskService', TaskService);

