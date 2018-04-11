function commonService($http, REST, authService, ngToast, $state, $rootScope) {
    var self = this;

    self.user = {};

    self.users = {
        kitchen: {
            type: "kitchen",
            labels: {
                main: "cuisine",
                switchTo: "Passer en salle",
                header: "Cuisine",
                headerBox: "Partie cuisine"
            }
        },
        order: {
            type: "room",
            labels: {
                main: "salle",
                switchTo: "Passer en cuisine",
                header: "Service en salle",
                headerBox: "Partie salle"
            }
        }
    }

    self.setUserType = function (type) {
        self.user = self.users[type];
        localStorage.setItem("userType", type);
        if (type === "kitchen") {
            window.socket.off("order.ready");
            window.socket.on("order.new", function (id) {
                console.log(id);
            })
        } else {
            window.socket.off("order.new");
            window.socket.on("order.ready", function (order) {
                console.log("ready");
                $rootScope.readyOrdersCount = 1;
                $rootScope.orderNumber = order.id;
                $rootScope.orderId = order._id;
                $rootScope.orderTableNumber = order.table;
                $rootScope.showNotif = true;
                ngToast.info("Une nouvelle commande est prête !")
                $rootScope.$apply();
            })
        }
    }

    self.disconnect = function () {
        return $http.delete(REST.ezorders + "/logout");
    }

    self.auth = function (user) {
        return $http.post(REST.ezorders + "/auth", user);
    }

    self.register = function (registration) {
        return $http.post(REST.ezorders + "/register", {
            "auth": {
                "login": registration.email,
                "password": registration.password
            },
            "info": {
                "name": registration.shopName
            }
        });
    }

    self.isAuth = function () {
        return $http.get(REST.ezorders + "/auth/current");
    }

    return self;
}

angular.module("app.common")
    .factory("commonService", commonService);