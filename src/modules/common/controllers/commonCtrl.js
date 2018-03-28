function commonCtrl() {
    var self = this;

    self.msg = "";


    return self;
}

angular.module("app.common")
    .controller("commonCtrl", commonCtrl);