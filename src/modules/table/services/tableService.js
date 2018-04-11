function tableService($http, REST) {
    var self = this;

    self.get = function (id) {
        angular.isUndefined(id) ? id = "" : id = "/" + id;
        return $http.get(REST.ezorders + "/customer/room/tables" + id);
    }

    self.add = function (product) {
        product.num = +product.num;
        return $http.post(REST.ezorders + "/customer/room/tables", product);
    }

    self.delete = function (product) {
        return $http.delete(REST.ezorders + "/customer/room/tables/" + product._id);
    }

    self.update = function (product) {
        return $http.put(REST.ezorders + "/customer/room/tables/" + product._id, JSON.parse(angular.toJson(product)));
    }

    return self;
}

angular.module("app.table")
    .factory("tableService", tableService);