function orderCtrl(orderDetails, initialOrder, tables, orderService, ngToast, $scope, $state) {
    var self = this;
    console.log(orderDetails);
    self.order = orderDetails.order;
    self.orderContent = self.order.products.concat(self.order.menus);
    self.initialOrder = initialOrder;
    self.products = orderDetails.products;
    self.menus = orderDetails.menus;
    self.contents = self.products.concat(self.menus).filter(function (c) {
        return !isContentInOrder(c);
    });
    self.tables = tables;
    self.order.ready = false;
    if (self.order.ready) ngToast.warning("Vous ne pouvez pas editer une commande déjà prête")

    $scope.$on('$destroy', function () {
        // save order
        save();
    });

    function save() {
        if (!objectEqual(rebuildObject(), self.initialOrder)) orderService.update(rebuildObject());
    }

    function hasEditRights() {
        if (self.order.ready) {
            ngToast.warning("Impossible d'editer une commande déjà prête")
            return false;
        }
        return true;
    }

    function isContentInOrder(content) {
        return self.orderContent.find(function (c) {
            return c._id === content._id;
        }) || false;
    }

    function objectEqual(a, b) {
        var c = angular.toJson(angular.fromJson(angular.toJson(a)));
        var d = angular.toJson(angular.fromJson(angular.toJson(b)));
        return c === d;
    }

    function rebuildObject() {
        var order = angular.copy(self.order);

        order.menus = [];
        order.products = [];

        self.orderContent.forEach(function (c) {
            var content = angular.copy(c);

            order[content.products ? 'menus' : 'products'].push({
                _id: content._id,
                quantity: content.quantity
            })
        });

        return order;
    }

    self.updateQuantity = function (content, type) {
        if (!hasEditRights()) {
            return;
        }
        if (type === "-") {
            if (content.quantity > 1) {
                content.quantity--;
            }
        } else if (type === "+") {
            content.quantity++;
        }
        save();
    }

    self.getTable = function (id) {
        return self.tables.find(function (el) {
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

    self.showDeleteOrder = function () {
        $('#deleteOrder').modal('show')
    }

    self.showAddContent = function () {
        $('#addContent').modal('show')
    }

    self.showDeleteContent = function (content) {
        if (!hasEditRights()) {
            return;
        }
        self.content = content;
        $('#deleteContent').modal('show');
    }

    self.deleteOrder = function () {
        orderService.delete(self.order)
            .then(function () {
                ngToast.success("Commande supprimée");
                $state.go("main.order");
            })
            .catch(function (reason) {
                ngToast.danger("Erreur lors de la suppression")
            })
    }

    self.addContent = function (content) {
        if (!hasEditRights()) {
            return;
        }
        $('#addContent').modal('hide');
        ngToast.success("Contenu ajouté");
        var c = angular.copy(content);
        c.quantity = 1;
        self.orderContent.push(c);
        self.contents = self.contents.filter(function (el) {
            return el._id !== content._id;
        })
        save();
        console.log(self.order);
    }

    self.deleteContent = function () {
        $('#deleteContent').modal('hide');
        self.content.removed = true;
        setTimeout(function () {
            self.orderContent = self.orderContent.filter(function (el) {
                return el._id !== self.content._id;
            });
        }, 500)
        ngToast.success("Contenu supprimé");
    }

    self.getTotal = function () {
        var tot = 0;

        self.orderContent.forEach(function (el) {
            tot += el.price * el.quantity;
        })

        return tot;
    }

    return self;
}

angular.module("app.order")
    .controller("editOrderCtrl", orderCtrl);