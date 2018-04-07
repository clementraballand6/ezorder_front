function menuCtrl(menus, products, menuService, ngToast, $filter, commonService) {
    var self = this;

    self.menus = menus;
    self.products = products;
    self.menu = initNewMenu();
    self.newMenu = initNewMenu();

    function initNewMenu() {
        return {
            products: [],
            price: 0
        };
    }

    function resetNewMenu() {
        self.newMenu = {
            products: [],
            price: 0
        }
    }

    self.menuHasProduct = function (menu) {
        return function (product) {
            return menu.products.indexOf(product._id) === -1
        }
    }

    self.toggleProduct = function (menu, product) {
        var index = menu.products.indexOf(product._id);
        if (index > -1) {
            menu.products.splice(index, 1);
        } else {
            menu.products.push(product._id);
        }
    }

    function updateMenu(menu) {
        var el = self.menus.find(function (el) {
            return el._id === menu._id;
        });
        console.log(menu);
        el.name = menu.name;
        el.products = menu.products;
        el.price = menu.price;
        el.enabled = menu.enabled;
    }

    self.showEditMenu = function (menu) {
        self.menu = angular.copy(menu);
        console.log(self.menu);
        $('#editMenu').modal('show');
    }

    self.toggleMenuEnabled = function (menu) {
        var m = angular.copy(menu);
        m.enabled = !m.enabled;
        menuService.update(m)
            .then(function (res) {
                updateMenu(res.data.menu);
            })
            .catch(function () {
                console.log('test');
                ngToast.danger("Erreur lors de la mise à jour");
            })
    }

    self.showDeleteMenu = function (menu) {
        self.menu = angular.copy(menu);
        $('#deleteMenu').modal('show');
    }

    function objectEqual(a, b) {
        var c = angular.toJson(angular.fromJson(angular.toJson(a)));
        var d = angular.toJson(angular.fromJson(angular.toJson(b)));
        return c === d;
    }

    self.blockEdition = function () {
        if (!self.menu) return true;
        return objectEqual(self.menu, self.menus.find(function (el) {
            return el._id === self.menu._id;
        }));
    }

    self.editMenu = function () {
        if (self.blockEdition()) {
            return;
        }
        console.log(self.menu);
        menuService.update(self.menu)
            .then(function (res) {
                $('#editMenu').modal('hide');
                ngToast.success("Menu mis à jour");
                updateMenu(res.data.menu);
                console.log("success");
            })
            .catch(function (err) {
                console.log(err);
                $('#editMenu').modal('hide');
                ngToast.danger("Erreur lors de la mise à jour du menu");
            })
    }

    self.addMenu = function () {
        menuService.add(self.newMenu)
            .then(function (res) {
                $('#addMenu').modal('hide');
                ngToast.success("Menu ajouté");
                self.menus.push(res.data.menu);
                resetNewMenu();
            })
            .catch(function (err) {
                $('#addMenu').modal('hide');
                ngToast.danger("Erreur lors de la création du menu");
            })
    }

    self.deleteMenu = function () {
        menuService.delete(self.menu)
            .then(function () {
                $('#deleteMenu').modal('hide');
                ngToast.success("Menu supprimé");
                var el = $filter('filter')(self.menus, {_id: self.menu._id})[0];
                el.removed = true;
            })
            .catch(function (err) {
                $('#deleteMenu').modal('hide');
                ngToast.danger("Erreur lors de la suppression du menu");
            })
    }

    return self;
}

angular.module("app.menu")
    .controller("menuCtrl", menuCtrl);