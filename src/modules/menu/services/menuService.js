function menuService($http, REST) {
    var self = this;

    self.get = function (id) {
        angular.isUndefined(id) ? id = "" : id = "/" + id;
        return $http.get(REST.ezorders + "/customer/kitchen/menus" + id);
    }

    self.add = function (menu) {
        menu.enabled = true;
        return $http.post(REST.ezorders + "/customer/kitchen/menus", menu);
    }

    self.delete = function (menu) {
        return $http.delete(REST.ezorders + "/customer/kitchen/menus/" + menu._id);
    }

    self.update = function (menu) {
        return $http.put(REST.ezorders + "/customer/kitchen/menus/" + menu._id, JSON.parse(angular.toJson(menu)));
    }

    return self;
}

angular.module("app.menu")
    .factory("menuService", menuService);