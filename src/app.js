// libs
window["jQuery"] = require('jquery/dist/jquery.min');
window["$"] = window["jQuery"];
require('popper.js/dist/umd/popper.min');
require('bootstrap/dist/js/bootstrap.min');
require('jquery-slimscroll/jquery.slimscroll.min');
require('fastclick/lib/fastclick');
require('admin-lte/dist/js/adminlte.min');
require('angular');
require('angular-cookies');
require('angular-animate');
require('angular-sanitize');
require('ng-toast');
require('@uirouter/angularjs/lib');

// modules
require('./modules/common');
require('./modules/menu');
require('./modules/product');

var deps = [
    "ngAnimate",
    "ngSanitize",
    "ngCookies",
    "ngToast",
    "ui.router",
    "app.common",
    "app.menu",
    "app.product"
];

var restUrls = {
    ezorders: "http://vps489645.ovh.net/preprod_api"
    //ezorders: "http://localhost:8080"
};

function commonRun(commonService, $state) {

}

function handle401($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $state, ngToast, authService) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 401) {
                    ngToast.danger("Vous avez été deconnecté");
                    authService.setAuthentified(false);
                    $state.go("login");
                }
                throw rejection;
            }
        };
    });
}

function toasterConfig(ngToastProvider) {
    ngToastProvider.configure({
        verticalPosition: 'middle',
        horizontalPosition: 'center',
        maxNumber: 3,
        animation: 'fade'
    });
}

function closeSideBar() {
    $(document.body).removeClass('sidebar-open');
}

function stateEvents($rootScope, $transitions, $state, authService) {
    $transitions.onBefore({}, function (trans) {
        closeSideBar();
        console.log("run2");
        $rootScope.content.isLoading = true;
        if (!authService.isAuthentified() && trans.to().name !== "login" && trans.to().name !== "register") {
            $rootScope.currentState = trans.to();
            return trans.router.stateService.target('login');
        } else if (authService.isAuthentified() && trans.to().name === "login") {
            $rootScope.currentState = trans.to();
            if (trans.from().name === "") {
                return trans.router.stateService.target('main.home');
            } else {
                return false;
            }
        }
        $rootScope.currentState = trans.to();
    });

    $transitions.onSuccess({}, function (trans) {
        $rootScope.content.isLoading = false;
        $rootScope.isLoading = false;
    });

    $transitions.onError({}, function (trans) {
        $rootScope.content.isLoading = false;
        $rootScope.isLoading = false;
        //if (trans.from().name === "") {
            // ui router bug, use standard state.go to workaround
          //  return $state.go('main.home');
        //} else {
          //  return false;
        //}
    });
}

angular.module('app', deps)
    .run(function (commonService, $state, $rootScope) {
        console.log("run1");
        $rootScope.content = {isLoading: false};
        $rootScope.currentState = $state.current;
        commonService.setUserType("order");
    })
    .run(stateEvents)
    .run(commonRun)
    .config(function ($urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');
        $httpProvider.defaults.withCredentials = true;
    })
    .config(handle401)
    .config(toasterConfig)
    .constant("REST", restUrls);