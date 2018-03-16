// force page reload on rebuild/module replacement (dev only)
if (module.hot) {
    module.hot.accept(function () {
        window.location.reload();
    })
}

// libs
require('./node_modules/angular');
require('./node_modules/@uirouter/angularjs/lib');

// modules
require('./modules/common');

// routes
require('./modules/routes');

var deps = [
    "ui.router",
    "app.common"
];

angular.module('app', deps);