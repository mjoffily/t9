'use strict';

var app = angular.module('t9', ['colorpicker.module', 'xeditable', 'ui.router', 'ngMaterial', 'ui.bootstrap']);

app.run(function($rootScope, $state) {
    $rootScope.$state = $state;    
});

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$sceDelegateProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $sceDelegateProvider) {
        $locationProvider.html5Mode(true);
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://source-mjoffily.c9.io/go/template/tabs/tab.html', 'https://source-mjoffily.c9.io/go/template/tabs/tabset.html']);
        
        $stateProvider.state('home', {
                url: "/",
                templateUrl: SiteParameters.theme_directory + '/js/partials/main-view.html'
            })
            .state('home.file', {
                url: "^/file/:idx",
                templateUrl: SiteParameters.theme_directory + '/js/partials/file-selected.html',
                controller: 'fileCtrl'
            })
            .state('home.file.diagram', {
                url: "/diagram",
                templateUrl: SiteParameters.theme_directory + '/js/partials/diagram-view.html',
                controller: 'diagramCtrl'
            })
            .state('home.file.flatview', {
                url: "/flatview",
                templateUrl: SiteParameters.theme_directory + '/js/partials/flat-view.html',
                controller: 'flatViewCtrl'
            })

    }]);

app.filter('slice', function() {
    return function(arr, start, end) {
        var cp = arr.slice(start, end);
        console.log("start " + start + " end " + end);
        return cp;
    };
});


app.filter('title', function() {
    return function(items, title) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (item.title.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

app.filter('titleWithMap', function() {
    return function(items, title) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (item.title.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                filtered[item.id] = item;
            }
        });
        return filtered;
    };
});

app.filter('nodeType', function() {
    return function(items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (item.type === 'node') {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

app.filter('nodeVisible', function() {
    return function(items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (item.formatting.visible) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

app.filter('attributeName', function() {
    return function(items, name) {
        var filteredNodes = [];
        angular.forEach(items, function(item) {
            for (var i = 0; i < item.metadata.length; i++) {
                if (item.metadata[i].name.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
                    filteredNodes[item.id] = item;
                    break;
                }
            }
        });
        return filteredNodes;
    };
});

app.filter('attributeValue', function() {
    return function(items, value) {
        var filteredNodes = [];
        angular.forEach(items, function(item) {
            for (var i = 0; i < item.metadata.length; i++) {
                if (item.metadata[i].value.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    filteredNodes[item.id] = item;
                    break;
                }
            }
        });
        return filteredNodes;
    };
});

app.filter('value', function() {
    return function(items, title) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (item.title.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});
