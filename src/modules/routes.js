var fs = require("fs");
var encoding = {encoding: 'utf8'};
angular.module("app.common")
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'home',
            url: '/',
            template: fs.readFileSync("src/modules/common/partials/home.html", encoding)
        }).state({
            name: 'about',
            url: '/about',
            template: '<h3>Its the UI-Router hello world app!</h3>'
        })
    });