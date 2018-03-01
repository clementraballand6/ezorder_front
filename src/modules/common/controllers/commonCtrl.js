function commonCtrl() {
    var self = this;

    self.msg = "Hello world!";

    return self;
}

angular.module("app.common")
    .controller("commonCtrl", commonCtrl);