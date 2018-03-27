// libs
window.jQuery = require('jquery/dist/jquery.min');
window.$ = window.jQuery;
require('popper.js/dist/umd/popper.min');
require('bootstrap/dist/js/bootstrap.min');
require('jquery-slimscroll/jquery.slimscroll.min');
require('fastclick/lib/fastclick');
require('admin-lte/dist/js/adminlte.min');
require('angular');
require('@uirouter/angularjs/lib');

// modules
require('./modules/common');

var deps = [
    "ui.router",
    "app.common"
];

angular.module('app', deps);