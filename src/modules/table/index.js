angular.module("app.table", []);

require('./controllers/tableCtrl')
require('./services/tableService')

angular.module("app.table")
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'main.table',
            url: '/table',
            resolve: {
                tables: function (tableService) {
                    return tableService.get().then(function (res) {
                        return res.data.tables;
                    }).catch(function (reason) { return [] });
                }
            },
            controller: "tableCtrl",
            controllerAs: "tCtrl",
            templateUrl: "modules/table/partials/table.html"
        })
    });