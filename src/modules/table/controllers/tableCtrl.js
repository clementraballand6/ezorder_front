function tableCtrl(tables, tableService, ngToast, $filter) {
    var self = this;

    self.tables = tables;

    self.newTable = {
        places: 0
    };

    function objectEqual(a, b) {
        var c = angular.toJson(angular.fromJson(angular.toJson(a)));
        var d = angular.toJson(angular.fromJson(angular.toJson(b)));
        return c === d;
    }

    function resetNewTable() {
        self.newTable = {
            places: 0
        }
    }

    function updateTable(table) {
        var el = self.tables.find(function (el) {
            return el._id === table._id;
        });
        console.log(table);
        el.num = table.num;
        el.desc = table.desc;
        el.places = table.places;
    }

    self.showEditTable = function (table) {
        self.table = angular.copy(table);
        $('#editTable').modal('show');
    }

    self.toggleTableEnabled = function (table) {
        var p = angular.copy(table);
        p.enabled = !p.enabled;
        tableService.update(p)
            .then(function (res) {
                updateTable(res.data.table);
            })
            .catch(function () {
                console.log('test');
                ngToast.danger("Erreur lors de la mise à jour");
            })
    }

    self.showDeleteTable = function (table) {
        self.table = angular.copy(table);
        $('#deleteTable').modal('show');
    }

    self.blockEdition = function () {
        if (!self.table) return true;
        return objectEqual(self.table, self.tables.find(function (el) {
            return el._id === self.table._id;
        }));
    }

    self.editTable = function () {
        if (self.blockEdition()) {
            return;
        }

        tableService.update(self.table)
            .then(function (res) {
                $('#editTable').modal('hide');
                ngToast.success("Table mise à jour");
                updateTable(res.data.table);
                console.log("success");
            })
            .catch(function (err) {
                console.log(err);
                $('#editTable').modal('hide');
                ngToast.danger("Erreur lors de la mise à jour de la table");
            })
    }

    self.addTable = function () {
        tableService.add(self.newTable)
            .then(function (res) {
                $('#addTable').modal('hide');
                ngToast.success("Table ajoutée");
                self.tables.push(res.data.table);
                resetNewTable();
            })
            .catch(function (err) {
                $('#addTable').modal('hide');
                ngToast.danger("Erreur lors de la création de la table");
            })
    }

    self.deleteTable = function () {
        tableService.delete(self.table)
            .then(function () {
                $('#deleteTable').modal('hide');
                ngToast.success("Table supprimée");
                var el = $filter('filter')(self.tables, {_id: self.table._id})[0];
                el.removed = true;
            })
            .catch(function (err) {
                $('#deleteTable').modal('hide');
                ngToast.danger("Erreur lors de la suppression de la table");
            })
    }

    return self;
}

angular.module("app.table")
    .controller("tableCtrl", tableCtrl);