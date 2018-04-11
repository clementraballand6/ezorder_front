function orderCtrl(ordersDetails, tables, orderService, ngToast, $filter, $state) {
    var self = this;
    self.orders = ordersDetails.orders;
    self.products = ordersDetails.products;
    self.menus = ordersDetails.menus;
    self.tables = tables;

    self.newOrder = {
        table: null,
        products: [],
        menus: []
    }

    window.socket.on("order.new", function (order) {
        orderService.getData(order._id)
            .then(function (res) {
                self.filteredOrders.push(res.order)
            }).catch(function (reason) { return [] })
    })

    console.log(self.orders);

    function getHours(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        return hrs;
    }

    function refreshFilteredOrders() {
        self.filteredOrders = self.orders.filter(function (el) {
            var now = new Date().getTime();
            var ts = new Date(el.createdAt).getTime();
            var hours = getHours(now - ts);
            return hours < 1 && !el.ready;
        })
    }

    refreshFilteredOrders();

    function objectEqual(a, b) {
        var c = angular.toJson(angular.fromJson(angular.toJson(a)));
        var d = angular.toJson(angular.fromJson(angular.toJson(b)));
        return c === d;
    }

    function resetNewOrder() {
        self.newOrder = {
            table: null,
            products: [],
            menus: []
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

    self.getPassedTime = function (time) {
        var now = new Date().getTime();
        var ts = self.toTimestamp(time);

        return now - ts;
    }

    self.passedTime = function (order) {
        return self.getPassedTime(order.createdAt);
    }

    self.getTable = function (id) {
        return self.tables.find(function (el) {
            return el._id === id;
        }) || {};
    }

    self.validatedOrder = function () {
        var order = angular.copy(self.selectedOrder);
        order.ready = true;
        orderService.update(order)
            .then(function () {
                ngToast.success("Commande validée");
                self.filteredOrders = self.filteredOrders.filter(function (el) {
                    return el._id !== self.selectedOrder._id
                });
                window.socket.emit('order.ready', {
                    _id: self.selectedOrder._id,
                    id: self.selectedOrder.num,
                    table: self.getTable(self.selectedOrder.table).num
                })
            })
            .catch(function (reason) {
                ngToast.danger("Erreur lors de la validation")
            })
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
                ngToast.success("Commande ajoutée");
                self.orders.push(res.data.order);
                resetNewOrder();
                $state.go("main.editOrder", {id: res.data.order._id});
            })
            .catch(function (err) {
                $('#addOrder').modal('hide');
                ngToast.danger("Erreur lors de la création de la commande");
            })
    }

    self.deleteOrder = function () {
        orderService.delete(self.order)
            .then(function () {
                $('#deleteOrder').modal('hide');
                ngToast.success("Commande supprimée");
                var el = $filter('filter')(self.orders, {_id: self.order._id})[0];
                el.removed = true;
            })
            .catch(function (err) {
                $('#deleteOrder').modal('hide');
                ngToast.danger("Erreur lors de la suppression de la commande");
            })
    }

    return self;
}

angular.module("app.order")
    .filter('timeAgo', function () {
        return function (s) {
            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;

            if (hrs > 0) {
                var format = "Il y a " + hrs + " heure(s)";
            } else if (mins > 0) {
                var format = "Il y a " + mins + " minute(s)";
            } else {
                var format = "Il y a " + secs + " seconde(s)";
            }

            return format;
        };
    })
    .controller("orderIncCtrl", orderCtrl);