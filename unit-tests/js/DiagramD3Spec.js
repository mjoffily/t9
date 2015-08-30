var SiteParameters = {
    theme_directory: 'test'
};

describe("DiagramD3Ctrl", function() {
    var $scope;
    var $rootScope;
    var t9Service;
    var $controller;
    var $stateParams;
    var diagramCtrl;
    var $parse;
    var $mdSidenav;
    var $log;
    var titleWithMapFilter;
    var attributeNameFilter;
    var attributeValueFilter;
    var data;

    beforeEach(function() {
        module('t9');
    });
    beforeEach(function() {
        inject(function($injector) {

            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            t9Service = $injector.get('t9Service');
            $parse = $injector.get('$parse');
            $mdSidenav = {}; // mock this out
            $log = $injector.get('$log');
            titleWithMapFilter = $injector.get('titleWithMapFilter');
            attributeNameFilter = $injector.get('attributeNameFilter');
            $controller = $injector.get('$controller');
            $stateParams = {
                idx: 0
            };
            $scope.data = [];
            $scope.data[$stateParams.idx] = {
                nodes: []
            };
            diagramCtrl = $controller('diagramCtrl', {
                $scope: $scope,
                '$parse': $parse,
                '$stateParams': $stateParams,
                '$mdSidenav': $mdSidenav,
                '$log': $log,
                't9Service': t9Service,
                'titleWithMapFilter': titleWithMapFilter,
                'attributeNameFilter': attributeNameFilter,
                'attributeValueFilter': attributeValueFilter
            });
        });
    });

    it('intitialization of variables', function() {
        expect($scope.tops).toEqual(0);
        expect($scope.file).toBeDefined();
    });

    describe('function buildReferencesToNodesPerLevel', function() {
        beforeEach(function() {
            $scope.data[$stateParams.idx] = {
                nodes: [{
                    id: 1,
                    children: [{
                        id: 2,
                        children: [{
                            id: 3,
                            children: []
                        }]
                    }]
                }]
            };
            diagramCtrl = $controller('diagramCtrl', {
                $scope: $scope,
                '$parse': $parse,
                '$stateParams': $stateParams,
                '$mdSidenav': $mdSidenav,
                '$log': $log,
                't9Service': t9Service,
                'titleWithMapFilter': titleWithMapFilter,
                'attributeNameFilter': attributeNameFilter,
                'attributeValueFilter': attributeValueFilter
            });
        });

        it('function buildReferencesToNodesPerLevel', function() {
            $scope.buildReferencesToNodesPerLevel();
            expect($scope.referencesPerLevel).toBeDefined();
            expect($scope.referencesPerLevel.length).toBe(3);
        });
    });
});
