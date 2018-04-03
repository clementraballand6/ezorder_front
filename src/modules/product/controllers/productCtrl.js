function productCtrl(products) {
    var self = this;

    self.products = products;

    return self;
}

angular.module("app.product")
    .controller("productCtrl", productCtrl);