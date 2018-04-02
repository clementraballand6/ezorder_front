function commonCtrl(commonService, authService, ngToast, $state) {
    var self = this;

    function onAuthSuccess() {
        authService.setAuthentified(true);
        $state.go('main.home');
    }

    function onAuthError() {
        ngToast.danger("Identifiants incorrects");
        authService.setAuthentified(false);
    }

    self.user = {};

    self.auth = function () {
        commonService.auth(self.user)
            .then(onAuthSuccess)
            .catch(onAuthError);
    };

    return self;
}

angular.module("app.common")
    .controller("commonCtrl", commonCtrl);