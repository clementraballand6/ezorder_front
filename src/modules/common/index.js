angular.module("app.common", []);

require('./controllers/commonCtrl');
require('./services/commonService');

angular.module("app.common")
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'home',
            url: '/',
            templateUrl: "modules/common/partials/home.html"
        }).state({
            name: 'about',
            url: '/about',
            template: 'test255'
        })
    });