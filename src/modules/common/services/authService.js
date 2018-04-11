function authService(ngToast, $state) {
    var self = this;

    self.setAuthentified = function (authentified) {
        console.log(authentified);
        if (angular.isUndefined(authentified)) authentified = true;
        window.localStorage.setItem("isAuthentified", JSON.stringify(authentified));
    }

    self.isAuthentified = function () {
        return JSON.parse(window.localStorage.getItem("isAuthentified"));
    }

    self.logout = function () {
        if (!self.isAuthentified()) return;

        self.setAuthentified(false);
        ngToast.danger("Vous avez été déconnecté");
        $state.go("login");
    }

    return self;
}

angular.module("app.common")
    .factory("authService", authService);