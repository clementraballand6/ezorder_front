angular.module("app.order", []);

require('./controllers/orderCtrl')
require('./controllers/editOrderCtrl')
require('./controllers/orderIncCtrl')
require('./services/orderService')

angular.module("app.order")
    .config(function ($stateProvider) {
        $stateProvider
            .state({
                name: 'main.order',
                url: '/order',
                resolve: {
                    ordersDetails: function (orderService) {
                        return orderService.getAllData().then(function (data) {
                            return data;
                        }).catch(function (reason) {
                            return {
                                orders: [],
                                products: [],
                                menus: []
                            }
                        });
                    },
                    tables: function (tableService) {
                        return tableService.get().then(function (res) {
                            return res.data.tables;
                        }).catch(function (reason) {
                            return []
                        });
                    }
                },
                controller: "orderCtrl",
                controllerAs: "oCtrl",
                templateUrl: "modules/order/partials/order.html"
            })
            .state({
                name: 'main.orderReady',
                url: '/orderReady',
                resolve: {
                    ordersDetails: function (orderService) {
                        return orderService.getAllData().then(function (data) {
                            return data;
                        }).catch(function (reason) {
                            return {
                                orders: [],
                                products: [],
                                menus: []
                            }
                        });
                    },
                    tables: function (tableService) {
                        return tableService.get().then(function (res) {
                            return res.data.tables;
                        }).catch(function (reason) {
                            return []
                        });
                    }
                },
                controller: "orderCtrl",
                controllerAs: "oCtrl",
                templateUrl: "modules/order/partials/orderReady.html"
            })
            .state({
                name: 'main.editOrder',
                url: '/order/:id',
                resolve: {
                    orderDetails: function (orderService, $stateParams) {
                        return orderService.getData($stateParams.id).then(function (data) {
                            return data;
                        }).catch(function (reason) {
                            return []
                        });
                    },
                    initialOrder: function (orderService, $stateParams) {
                        return orderService.get($stateParams.id).then(function (res) {
                            return res.data.order;
                        }).catch(function (reason) {
                            return []
                        });
                    },
                    tables: function (tableService) {
                        return tableService.get().then(function (res) {
                            return res.data.tables;
                        }).catch(function (reason) {
                            return []
                        });
                    }
                },
                controller: "editOrderCtrl",
                controllerAs: "oCtrl",
                templateUrl: "modules/order/partials/edit.html"
            })
            .state({
                name: 'main.orderIncoming',
                url: '/orderIncoming',
                resolve: {
                    ordersDetails: function (orderService) {
                        return orderService.getAllData().then(function (data) {
                            return data;
                        }).catch(function (reason) {
                            return {
                                orders: [],
                                products: [],
                                menus: []
                            }
                        });
                    },
                    tables: function (tableService) {
                        return tableService.get().then(function (res) {
                            return res.data.tables;
                        }).catch(function (reason) {
                            return []
                        });
                    }
                },
                controller: "orderIncCtrl",
                controllerAs: "oCtrl",
                templateUrl: "modules/order/partials/orderIncoming.html"
            })
    });