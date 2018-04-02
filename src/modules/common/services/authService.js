function authService() {
    var self = this;

    self.setAuthentified = function (authentified) {
        if (angular.isUndefined(authentified)) authentified = true;
        window.localStorage.setItem("isAuthentified", JSON.stringify(authentified));
    }

    self.isAuthentified = function () {
        return JSON.parse(window.localStorage.getItem("isAuthentified"));
    }

    return self;
}

angular.module("app.common")
    .factory("authService", authService);