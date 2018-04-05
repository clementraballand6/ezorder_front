function productService($http, REST) {
    var self = this;

    self.get = function (id) {
        angular.isUndefined(id) ? id = "" : id = "/" + id;
        return $http.get(REST.ezorders + "/customer/kitchen/products" + id);
    }

    self.add = function (product) {
        return $http.post(REST.ezorders + "/customer/kitchen/products", product);
    }

    self.delete = function (product) {
        return $http.delete(REST.ezorders + "/customer/kitchen/products/" + product._id);
    }

    self.update = function (product) {
        return $http.put(REST.ezorders + "/customer/kitchen/products/" + product._id, JSON.parse(angular.toJson(product)));
    }

    return self;
}

angular.module("app.product")
    .factory("productService", productService);