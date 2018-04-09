function orderCtrl(ordersDetails, tables, orderService, ngToast, $filter, $state) {
    var self = this;
    self.orders = ordersDetails.orders;
    self.products = ordersDetails.products;
    self.menus = ordersDetails.menus;
    self.tables = tables;
    self.newOrder = {
        places: 0
    };

    console.log(self.orders);

    function objectEqual(a, b) {
        var c = angular.toJson(angular.fromJson(angular.toJson(a)));
        var d = angular.toJson(angular.fromJson(angular.toJson(b)));
        return c === d;
    }

    function resetNewOrder() {
        self.newOrder = {
            places: 0
        }
    }

    function updateOrder(order) {
        var el = self.orders.find(function (el) {
            return el._id === order._id;
        });
        console.log(order);
        el.num = order.num;
        el.desc = order.desc;
        el.places = order.places;
    }

    self.getTable = function (id) {
        return self.tables.find(function (el) {
            return el._id === id;
        }) || {};
    }


    self.toggleProduct = function (order, product) {
        var index = order.products.indexOf(product._id);
        if (index > -1) {
            order.products.splice(index, 1);
        } else {
            order.products.push(product._id);
        }
    }

    self.getProduct = function (id) {
        return self.products.find(function (el) {
            return el._id === id;
        }) || {};
    }

    self.getMenu = function (id) {
        return self.menus.find(function (el) {
            return el._id === id;
        }) || {};
    }

    self.getTotal = function (order) {
        var amount = 0;
        if (order.products && order.products.length) {
            order.products.forEach(function (el) {
                amount += self.getProduct(el._id).price * el.quantity;
            })
        }

        if (order.menus && order.menus.length) {
            order.menus.forEach(function (el) {
                amount += self.getMenu(el._id).price * el.quantity;
            })
        }

        return amount;
    }

    self.toTimestamp = function (date) {
        return new Date(date).getTime();
    }

    self.edit = function (order) {
        $state.go("main.editOrder", {id: order._id})
    }

    self.orderHasProduct = function (order) {
        return function (product) {
            if (!order || !order.product) return false;
            return order.products.indexOf(product._id) === -1
        }
    }

    self.showDeleteOrder = function (order) {
        self.order = angular.copy(order);
        $('#deleteOrder').modal('show');
    }

    self.blockEdition = function () {
        if (!self.order) return true;
        return objectEqual(self.order, self.orders.find(function (el) {
            return el._id === self.order._id;
        }));
    }

    self.editOrder = function () {
        if (self.blockEdition()) {
            return;
        }

        orderService.update(self.order)
            .then(function (res) {
                $('#editOrder').modal('hide');
                ngToast.success("Order mise à jour");
                updateOrder(res.data.order);
                console.log("success");
            })
            .catch(function (err) {
                console.log(err);
                $('#editOrder').modal('hide');
                ngToast.danger("Erreur lors de la mise à jour de la order");
            })
    }

    self.addOrder = function () {
        orderService.add(self.newOrder)
            .then(function (res) {
                $('#addOrder').modal('hide');
                ngToast.success("Order ajoutée");
                self.orders.push(res.data.order);
                resetNewOrder();
            })
            .catch(function (err) {
                $('#addOrder').modal('hide');
                ngToast.danger("Erreur lors de la création de la order");
            })
    }

    self.deleteOrder = function () {
        orderService.delete(self.order)
            .then(function () {
                $('#deleteOrder').modal('hide');
                ngToast.success("Order supprimée");
                var el = $filter('filter')(self.orders, {_id: self.order._id})[0];
                el.removed = true;
            })
            .catch(function (err) {
                $('#deleteOrder').modal('hide');
                ngToast.danger("Erreur lors de la suppression de la order");
            })
    }

    return self;
}

angular.module("app.order")
    .controller("orderCtrl", orderCtrl);