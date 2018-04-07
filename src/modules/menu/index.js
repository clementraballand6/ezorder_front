angular.module("app.menu", []);

require('./controllers/menuCtrl')
require('./services/menuService')

angular.module("app.menu")
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'main.menu',
            url: '/menu',
            resolve: {
                menus: function (menuService) {
                    return menuService.get().then(function (res) {
                        return res.data.menus;
                    }).catch(function (reason) { return [] });
                },
                products: function (productService, $rootScope) {
                    return productService.get().then(function (res) {
                        return res.data.products;
                    }).catch(function (reason) { return [] });
                }
            },
            controller: "menuCtrl",
            controllerAs: "mCtrl",
            templateUrl: "modules/menu/partials/menu.html"
        })
    });