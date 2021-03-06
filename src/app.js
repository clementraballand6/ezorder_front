// libs
window["jQuery"] = require('jquery/dist/jquery.min');
window["$"] = window["jQuery"];
var io = require('socket.io-client');
var socketUrl = "http://" + location.hostname + ":3333"
window.socket = io.connect(socketUrl);

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
require('angular-touch');
require('@uirouter/angularjs/lib');

// modules
require('./modules/common');
require('./modules/menus');
require('./modules/menu');
require('./modules/product');
require('./modules/table');
require('./modules/order');

var deps = [
    "ngAnimate",
    "ngTouch",
    "ngSanitize",
    "ngCookies",
    "ngToast",
    "ui.router",
    "app.common",
    "app.menus",
    "app.menu",
    "app.product",
    "app.table",
    "app.order"
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
                    authService.logout();
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

function sidebar(action) {
    action === "open" ? $(document.body).addClass('sidebar-open') : $(document.body).removeClass('sidebar-open');
}

function stateEvents($rootScope, $transitions, $state, authService) {
    $transitions.onBefore({}, function (trans) {
        !$rootScope.sidebar ? $rootScope.sidebar = sidebar : '';
        $('.modal').modal('hide') // closes all active pop ups.
        $('.modal-backdrop').remove() // removes the grey overlay.
        sidebar("close");
        $rootScope.content.isLoading = true;
        if (!authService.isAuthentified() && trans.to().name !== "login" && trans.to().name !== "register") {
            console.log("redirect");
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
    .run(function (commonService, $state, $rootScope, authService) {
        $rootScope.content = {isLoading: false};
        $rootScope.currentState = $state.current;
        $rootScope.readyOrdersCount = null;

        $rootScope.onOrderNotifClicked = function () {
            $rootScope.showNotif = false;
            $rootScope.readyOrdersCount = null;
            $state.go("main.editOrder", {id: $rootScope.orderId});
        };

        commonService.isAuth().then(function (res) {
            if (!res.data.authentified) {
                console.log("not auth");
                authService.setAuthentified(false);
                $state.go("login")
            } else {
                commonService.setUserType(localStorage.getItem("userType"));
                $rootScope.labels = commonService.user.labels;
                $rootScope.type = commonService.user.type;
            }
        })
    })
    .run(stateEvents)
    .run(commonRun)
    .config(function ($urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/orderReady');
        $httpProvider.defaults.withCredentials = true;
    })
    .config(handle401)
    .config(toasterConfig)
    .constant("REST", restUrls);