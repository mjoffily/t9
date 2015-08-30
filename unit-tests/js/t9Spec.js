var SiteParameters = {theme_directory: 'test'};

describe("t9 application test suite", function() {
    var $scope;
    var $rootScope;
    var $q;
    var $http;
    var t9Service;
    var $controller;
    var colorpicker;
    var xeditable;
    var uiRouter;
    var $state;
    var $stateParams;
    
    beforeEach(function() {
       module('t9');
    });
    beforeEach(function() {
        inject(function($injector) {

            //colorpicker = $injector.get('colorpicker.module');
            //xeditable = $injector.get('xeditable');
            ///uiRouter = $injector.get('ui.router');
           // module(function ($provide) {
             //   $provide.value('xeditable', xeditable);
             //   $provide.value('ui.router', uiRouter);
           // });
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
    
    it('should have tests', function() {
        spyOn(t9Service, "getDataFromLocalStorage").and.callFake(function() {
            var deferred = $q.defer();
            var result = {
              data: "no data"
            };
            deferred.resolve('Remote call result');
            return deferred.promise;
        });
        $controller('mainCtrl', {'$scope': $scope, 't9Service': t9Service, '$state': $state, '$stateParams': $stateParams, '$q':$q});
        expect(t9Service.getDataFromLocalStorage.calls.count()).toEqual(1); 
    }); 
});
