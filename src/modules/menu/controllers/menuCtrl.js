function menuCtrl(commonService, $rootScope) {
    var self = this;

    self.labels = commonService.user.labels;

    $rootScope.isLoading = false;

    return self;
}

angular.module("app.menu")
    .controller("menuCtrl", menuCtrl);