function menusCtrl(commonService, authService, $state, $rootScope) {
    var self = this;
    console.log(self);

    function onDisconnect() {
        authService.setAuthentified(false);
        $state.go("login");
    }

    self.disconnect = function () {
        commonService.disconnect().finally(onDisconnect);
    }

    self.setUserType = function (type) {
        $rootScope.isLoading = true;
        commonService.setUserType(type);
        $rootScope.labels = commonService.user.labels;
        $rootScope.type = commonService.user.type;
        if (type === "order"){
            console.log("going order")
            $state.go("main.orderReady")
        } else {
            $state.go("main.orderIncoming");
        }
    }

    return self;
}

angular.module("app.menus")
    .controller("menusCtrl", menusCtrl);