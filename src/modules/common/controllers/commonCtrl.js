function commonCtrl(commonService, authService, ngToast, $state, $rootScope) {
    var self = this;

    function onAuthSuccess() {
        authService.setAuthentified(true);
        $state.go('main.home');
    }

    function onAuthError() {
        $rootScope.isLoading = false;
        ngToast.danger("Identifiants incorrects");
        authService.setAuthentified(false);
    }

    function onRegisterSuccess() {
        ngToast.success("Compte créé avec succès, vous pouvez vous connecter")
        $state.go('login');
    }

    function onRegisterError() {
        $rootScope.isLoading = false;
        ngToast.danger("Erreur lors de la création du compte, veuillez réessayer");
    }

    self.user = {};
    self.register = {};

    self.auth = function () {
        $rootScope.isLoading = true;
        commonService.auth(self.user)
            .then(onAuthSuccess)
            .catch(onAuthError);
    };

    self.register = function () {
        if (self.register.password !== self.register.passwordCheck) {
            ngToast.danger("Les mots de passes ne sont pas identiques");
        } else {
            commonService.register(self.register)
                .then(onRegisterSuccess)
                .catch(onRegisterError);
        }
    };

    return self;
}

angular.module("app.common")
    .controller("commonCtrl", commonCtrl);