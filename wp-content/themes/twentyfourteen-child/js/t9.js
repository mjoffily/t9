'use strict';

var app = angular.module('treeApp', ['ui.tree', 'colorpicker.module', 'ngDialog', 'xeditable', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
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

    });

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

// app.filter('name', function() {
//     return function(items, title) {
//         var filteredNodes = [];
//         angular.forEach(items, function(item) {
//             var metadataFiltered = [];
//             angular.forEach(metadataList, function(metadata) {
//                 if (metadata.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
//                     metadatafiltered.push(metadata);
//                 }
//             });
//             if (metadataFiltered.length > 0) {
                
//                 filteredNodes.push()
//             }
            
//         });
//         return filtered;
//     };
// });

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
