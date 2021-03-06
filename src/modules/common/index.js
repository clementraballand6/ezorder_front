angular.module("app.common", []);

require('./controllers/commonCtrl');
require('./services/authService');
require('./services/commonService');

angular.module("app.common")
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'main',
            templateUrl: "modules/common/partials/main.html"
        }).state({
            name: 'login',
            url: '/login',
            controller: "commonCtrl",
            controllerAs: "cCtrl",
            templateUrl: "modules/common/partials/login.html"
        }).state({
            name: 'register',
            url: '/register',
            controller: "commonCtrl",
            controllerAs: "cCtrl",
            templateUrl: "modules/common/partials/register.html"
        }).state({
            name: 'choice',
            url: '/choice',
            templateUrl: "modules/common/partials/choice.html"
        })
    })
    .directive('loader', function () {
        return {
            templateUrl: "modules/common/partials/loader.html"
        };
    });