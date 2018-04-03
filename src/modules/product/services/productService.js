function productService($http, REST) {
    var self = this;

    self.get = function (id) {
        angular.isUndefined(id) ? id = "" : id = "/" + id;
        return $http.get(REST.ezorders + "/customer/kitchen/product" + id);
    }

    return self;
}

angular.module("app.product")
    .factory("productService", productService);