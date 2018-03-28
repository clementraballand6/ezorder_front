function menuCtrl(commonService, $rootScope) {
    var self = this;

    self.labels = commonService.user.labels;

    return self;
}

angular.module("app.menu")
    .controller("menuCtrl", menuCtrl);