function orderService($http, REST, $q, productService, menuService) {
    var self = this;

    function buildOrder(order) {
        ["menus", "products"].forEach(function (type) {
            if (order[type]) {
                var items = angular.copy(order[type]);
                order[type] = [];
                items.forEach(function (el) {
                    var item = self[type].find(function (p) {
                        return p._id === el._id
                    });
                    item.quantity = el.quantity;
                    order[type].push(angular.copy(item));
                })
            }
        });

        return order;
    }

    self.get = function (id) {
        angular.isUndefined(id) ? id = "" : id = "/" + id;
        return $http.get(REST.ezorders + "/customer/room/orders" + id);
    }

    self.getAllData = function () {
        var getOrders = $http.get(REST.ezorders + "/customer/room/orders");
        return $q.all([getOrders, productService.get(), menuService.get()])
            .then(function (promises) {
                ["orders", "products", "menus"].forEach(function (key, index) {
                    self[key] = promises[index].data[key];
                });

                var o = [];
                self.orders.forEach(function (el) {
                    o.push(buildOrder(el))
                });

                return {
                    orders: o,
                    menus: angular.copy(self.menus),
                    products: angular.copy(self.products)
                }
            })
    }

    self.getData = function (id) {
        var getOrders = $http.get(REST.ezorders + "/customer/room/orders/" + id);
        return $q.all([getOrders, productService.get(), menuService.get()])
            .then(function (promises) {
                ["order", "products", "menus"].forEach(function (key, index) {
                    self[key] = promises[index].data[key];
                });

                return {
                    order: buildOrder(self.order),
                    menus: angular.copy(self.menus),
                    products: angular.copy(self.products)
                }
            })
    }

    self.add = function (order) {
        order.ready = false;
        return $http.post(REST.ezorders + "/customer/room/orders", order);
    }

    self.delete = function (order) {
        return $http.delete(REST.ezorders + "/customer/room/orders/" + order._id);
    }

    self.update = function (order) {
        delete order.createdAt;
        delete order.num;
        return $http.put(REST.ezorders + "/customer/room/orders/" + order._id, JSON.parse(angular.toJson(order)));
    }

    return self;
}

angular.module("app.order")
    .factory("orderService", orderService);