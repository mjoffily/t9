var SiteParameters = {
    theme_directory: 'test'
};

describe("MainCtrl", function() {
    var $scope;
    var $rootScope;
    var t9Service;
    var $controller;
    var $stateParams;
    var $state;
    var $q;
    var ctrl;
    var data;

    beforeEach(function() {
        module('t9');
    });
    beforeEach(function() {
        inject(function($injector) {

            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            t9Service = $injector.get('t9Service');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $controller = $injector.get('$controller');
            $stateParams = {
                idx: 0
            };
            $scope.data = [];
            $scope.data[$stateParams.idx] = {
                nodes: []
            };
            ctrl = $controller('diagramCtrl', {
                $scope: $scope,
                't9Service': t9Service,
                '$state': $state,
                '$stateParams': $stateParams,
                '$q': $q
            });
            
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

        });
    });

    it('deleteNode - currentNode is set to sibling to the left if it exists', function() {
        $scope.currentNode = 
        $scope.deleteNode();
        expect($scope.file).toBeDefined();
    });

    it('deleteNode - currentNode is set to sibling to the right if to the left does not exist', function() {
        expect($scope.file).toBeDefined();
    });

    it('deleteNode - currentNode is set to parent if no sibilings exist', function() {
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
