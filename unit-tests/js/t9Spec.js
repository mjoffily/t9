var SiteParameters = {
    theme_directory: 'test'
};

describe("t9 application test suite", function() {
    var $scope;
    var $rootScope;
    var $q;
    var $http;
    var t9Service;
    var $controller;
    var ctrl;
    var colorpicker;
    var xeditable;
    var uiRouter;
    var $state;
    var ngMaterial;
    var $stateParams;

    beforeEach(function() {
        module('t9');
    });
    beforeEach(function() {
        inject(function($injector) {

            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $q = $injector.get('$q');
            $http = $injector.get('$http');
            $state = $injector.get('$state');
            $stateParams = $injector.get('$stateParams');
            t9Service = $injector.get('t9Service');
            $controller = $injector.get('$controller');
        });
    });

    describe('getDataFromLocalStorage verification', function() {
        it('call get data from storage once', function() {
            spyOn(t9Service, "getDataFromLocalStorage").and.callFake(function() {
                var deferred = $q.defer();
                var result = {
                    data: "no data"
                };
                deferred.resolve('Remote call result');
                return deferred.promise;
            });
            ctrl = $controller('mainCtrl', {
                '$scope': $scope,
                't9Service': t9Service,
                '$state': $state,
                '$stateParams': $stateParams,
                '$q': $q
            });

            expect(t9Service.getDataFromLocalStorage.calls.count()).toEqual(1);
        });
    });

    describe('delete node functionality when deleting at the top level of the tree', function() {
        beforeEach(function() {
            spyOn(t9Service, "getDataFromLocalStorage").and.callFake(function() {
                var deferred = $q.defer();
                var result = {data: ""};
                result.data = [{
                    "nodes": [{
                        "id": 1,
                        "type": "node",
                        "formatting": {},
                        "children": []
                    }, {
                        "id": 2,
                        "type": "node",
                        "formatting": {},
                        "children": []
                    }, {
                        "id": 3,
                        "type": "node",
                        "formatting": {},
                        "children": []
                    }, {
                        "id": 4,
                        "type": "node",
                        "formatting": {},
                        "children": []
                    }] 
                }];
                deferred.resolve(result);
                return deferred.promise;
            });
            ctrl = $controller('mainCtrl', {
                '$scope': $scope,
                't9Service': t9Service,
                '$state': $state,
                '$stateParams': $stateParams,
                '$q': $q
            });
        })
        
        afterEach(inject(function($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

        it('deleteNode - currentNode is set to sibling to the left if it exists', inject(function($httpBackend) {
            $httpBackend.whenGET("test/js/partials/main-view.html").respond({ hello: 'World' });
            //expect a get request to "internalapi/quotes"
            $httpBackend.expectGET("test/js/partials/main-view.html");
            //run apply to resolve all promises
            $rootScope.$apply();
            $scope.setCurrentFile(0);
            // call find node to set the current node to the one with id = 2
            $scope.findNode(4, false);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(3);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(2);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(1);
            $scope.deleteNode(); 
            expect($scope.currentNode).toBeUndefined();
            $httpBackend.flush();
        }));

        it('deleteNode - currentNode is set to sibling to the right if the one on the left does not exist', inject(function($httpBackend) {
            $httpBackend.whenGET("test/js/partials/main-view.html").respond({ hello: 'World' });
            //expect a get request to "internalapi/quotes"
            $httpBackend.expectGET("test/js/partials/main-view.html");
            //run apply to resolve all promises
            $rootScope.$apply();
            $scope.setCurrentFile(0);
            // call find node to set the current node to the one with id = 2
            $scope.findNode(1, false);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(2);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(3);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(4);
            $scope.deleteNode(); 
            expect($scope.currentNode).toBeUndefined();
            $httpBackend.flush();
        }));
    })

    describe('delete node functionality when deleting at a lower level of the tree', function() {
        beforeEach(function() {
            spyOn(t9Service, "getDataFromLocalStorage").and.callFake(function() {
                var deferred = $q.defer();
                var result = {data: ""};
                result.data = [{
                    "nodes": [{
                        "id": 1,
                        "type": "node",
                        "formatting": {},
                        "children": [{"id":10, "type":"node", "formatting":{}, "children":[]},
                                     {"id":11, "type":"node", "formatting":{}, "children":[]},
                                     {"id":12, "type":"node", "formatting":{}, "children":[]},
                                     {"id":13, "type":"node", "formatting":{}, "children":[]}]
                            }]
                    }];
                deferred.resolve(result);
                return deferred.promise;
            });
            ctrl = $controller('mainCtrl', {
                '$scope': $scope,
                't9Service': t9Service,
                '$state': $state,
                '$stateParams': $stateParams,
                '$q': $q
            });
        })

        afterEach(inject(function($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));
        
        it('deleteNode - currentNode is set to sibling to the left if it exists', inject(function($httpBackend) {
            $httpBackend.whenGET("test/js/partials/main-view.html").respond({ hello: 'World' });
            //expect a get request to "internalapi/quotes"
            $httpBackend.expectGET("test/js/partials/main-view.html");
            //run apply to resolve all promises
            $rootScope.$apply();
            $scope.setCurrentFile(0);
            // call find node to set the current node to the one with id = 2
            $scope.findNode(13, false);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(12);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(11);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(10);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(1);
            $scope.deleteNode(); 
            expect($scope.currentNode).toBeUndefined();
            $httpBackend.flush();
        }));

        it('deleteNode - currentNode is set to sibling to the right if the one on the left does not exist', inject(function($httpBackend) {
            $httpBackend.whenGET("test/js/partials/main-view.html").respond({ hello: 'World' });
            //expect a get request to "internalapi/quotes"
            $httpBackend.expectGET("test/js/partials/main-view.html");
            //run apply to resolve all promises
            $rootScope.$apply();
            $scope.setCurrentFile(0);
            // call find node to set the current node to the one with id = 2
            $scope.findNode(10, false);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(11);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(12);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(13);
            $scope.deleteNode(); 
            expect($scope.currentNode.id).toBe(1);
            $scope.deleteNode(); 
            expect($scope.currentNode).toBeUndefined();
            $httpBackend.flush();
        }));
    })

});
