angular.module("app.product", []);

require('./controllers/productCtrl')
require('./services/productService')

angular.module("app.product")
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'main.product',
            url: '/product',
            resolve: {
                products: function (productService) {
                    return productService.get().then(function (res) {
                        return res.data.products;
                    });
                }
            },
            controller: "productCtrl",
            controllerAs: "pCtrl",
            templateUrl: "modules/product/partials/product.html"
        })
    });