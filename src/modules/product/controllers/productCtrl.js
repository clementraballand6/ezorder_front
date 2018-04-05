function productCtrl(products, productService, ngToast, $filter) {
    var self = this;

    self.products = products;
    console.log(products);
    self.newProduct = {
        price: 0
    };

    function resetNewProduct() {
        self.newProduct = {
            price: 0
        }
    }

    function updateProduct(product) {
        var el = self.products.find(function (el) {
            return el._id === product._id;
        });
        console.log(product);
        el.name = product.name;
        el.price = product.price;
        el.enabled = product.enabled;
        el.composition = product.composition;
        el.description = product.description;
    }

    self.showEditProduct = function (product) {
        self.product = angular.copy(product);
        $('#editProduct').modal('show');
    }

    self.toggleProductEnabled = function (product) {
        var p = angular.copy(product);
        p.enabled = !p.enabled;
        productService.update(p)
            .then(function (res) {
                updateProduct(res.data.product);
            })
            .catch(function () {
                console.log('test');
                ngToast.danger("Erreur lors de la mise à jour");
            })
    }

    self.showDeleteProduct = function (product) {
        self.product = angular.copy(product);
        $('#deleteProduct').modal('show');
    }

    function objectEqual(a, b) {
        var c = angular.toJson(angular.fromJson(angular.toJson(a)));
        var d = angular.toJson(angular.fromJson(angular.toJson(b)));
        return c === d;
    }

    self.blockEdition = function () {
        if (!self.product) return true;
        return objectEqual(self.product, self.products.find(function (el) {
            return el._id === self.product._id;
        }));
    }

    self.editProduct = function () {
        if (self.blockEdition()) {
            return;
        }

        productService.update(self.product)
            .then(function (res) {
                $('#editProduct').modal('hide');
                ngToast.success("Produit mis à jour");
                updateProduct(res.data.product);
                console.log("success");
            })
            .catch(function (err) {
                console.log(err);
                $('#editProduct').modal('hide');
                ngToast.danger("Erreur lors de la mise à jour du produit");
            })
    }

    self.addProduct = function () {
        productService.add(self.newProduct)
            .then(function (res) {
                $('#addProduct').modal('hide');
                ngToast.success("Produit ajouté");
                self.products.push(res.data.product);
                resetNewProduct();
            })
            .catch(function (err) {
                $('#addProduct').modal('hide');
                ngToast.danger("Erreur lors de la création du produit");
            })
    }

    self.deleteProduct = function () {
        productService.delete(self.product)
            .then(function () {
                $('#deleteProduct').modal('hide');
                ngToast.success("Produit supprimé");
                var el = $filter('filter')(self.products, {_id: self.product._id})[0];
                el.removed = true;
            })
            .catch(function (err) {
                $('#deleteProduct').modal('hide');
                ngToast.danger("Erreur lors de la suppression du produit");
            })
    }

    return self;
}

angular.module("app.product")
    .controller("productCtrl", productCtrl);