// libs
window["jQuery"] = require('jquery/dist/jquery.min');
window["$"] = window["jQuery"];
require('popper.js/dist/umd/popper.min');
require('bootstrap/dist/js/bootstrap.min');
require('jquery-slimscroll/jquery.slimscroll.min');
require('fastclick/lib/fastclick');
require('admin-lte/dist/js/adminlte.min');
require('angular');
require('@uirouter/angularjs/lib');

// modules
require('./modules/common');
require('./modules/menu');

var deps = [
    "ui.router",
    "app.common",
    "app.menu"
];

function stateEvents($rootScope, $transitions) {
    $transitions.onStart({}, function (trans) {
        $rootScope.isLoading = true;
    });

    $transitions.onStart({}, function (trans) {
        $rootScope.isLoading = false;
    });
}

angular.module('app', deps)
    .run(stateEvents)
    .run(function (commonService, $rootScope) {
        console.log("dddd");
        commonService.setUserType("order");
    })
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });