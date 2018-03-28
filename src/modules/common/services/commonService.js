function commonService($rootScope) {
    var self = this;

    self.users = {
        kitchen: {
            type: "order",
            labels: {
                header: "Cuisine",
                headerBox: "Partie cuisine"
            }
        },
        order: {
            type: "order",
            labels: {
                header: "Service en salle",
                headerBox: "Partie salle"
            }
        }
    }

    self.setUserType = function (type) {
        self.user = self.users[type]
    }


    return self;
}

angular.module("app.common")
    .factory("commonService", commonService);