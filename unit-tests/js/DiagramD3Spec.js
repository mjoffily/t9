/* global inject */
/* global expect */
/* global spyOn */

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
            $scope.currentFile = {nodes: []};
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
            $scope.currentFile = {
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

    describe('function draw', function() {
        beforeEach(function() {
            $scope.getParent = function() {
                return 1;
            }
            $scope.currentFile = {
                max_node_id: 0,
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
            spyOn($scope, 'getParent').and.returnValue(undefined);
        });

        it('correct x, y, width, height coordinates when adding a single node to a blank canvas with zero margin', function() {
            
			var a = {
    			id: 1,
    			type: 'node',
    			title: 'test',
    			formatting: {
    				width: 100,
    				height: 100,
    				marginLeft: 0
    			},
    			metadata: [],
    			children: []
		    };

	    	$scope.currentFile.nodes.splice(0, 0, a);
    
            $scope.calculateWidthHeightAndX();
            expect($scope.currentFile.nodes[0]).toBeDefined();
            expect($scope.currentFile.nodes[0].formatting).toBeDefined();
            expect($scope.currentFile.nodes[0].formatting.x).toBe(0);
            expect($scope.currentFile.nodes[0].formatting.y).toBe(0);
            expect($scope.currentFile.nodes[0].formatting.width).toBe(100);
            expect($scope.currentFile.nodes[0].formatting.height).toBe(100);
            expect($scope.getParent).toHaveBeenCalled();
        });

        it('correct x, y, width, height coordinates when adding a single node to a blank canvas with a margin greater than zero', function() {
            
			var a = {
    			id: 1,
    			type: 'node',
    			title: 'test',
    			formatting: {
    				width: 100,
    				height: 100,
    				marginLeft: 10
    			},
    			metadata: [],
    			children: []
		    };

	    	$scope.currentFile.nodes.splice(0, 0, a);
    
            $scope.calculateWidthHeightAndX();
            expect($scope.currentFile.nodes[0]).toBeDefined();
            expect($scope.currentFile.nodes[0].formatting).toBeDefined();
            expect($scope.currentFile.nodes[0].formatting.x).toBe(10);
            expect($scope.currentFile.nodes[0].formatting.y).toBe(0);
            expect($scope.currentFile.nodes[0].formatting.width).toBe(100);
            expect($scope.currentFile.nodes[0].formatting.height).toBe(100);
            expect($scope.getParent).toHaveBeenCalled();
        });

        it('correct x, y, width, height coordinates when adding a two nodes to a blank canvas with a margin greater than zero', function() {
            
			var a = {
    			id: 1,
    			type: 'node',
    			title: 'test',
    			formatting: {
    				width: 100,
    				height: 100,
    				marginLeft: 10,
    				marginRight: 0
    			},
    			metadata: [],
    			children: []
		    };
			var b = {
    			id: 2,
    			type: 'node',
    			title: 'test',
    			formatting: {
    				width: 100,
    				height: 100,
    				marginLeft: 10,
    				marginRight: 0,
    			},
    			metadata: [],
    			children: []
		    };

	    	$scope.currentFile.nodes.splice(0, 0, a, b);
    
            $scope.calculateWidthHeightAndX();
            expect($scope.currentFile.nodes[0].formatting.x).toBe(10);
            expect($scope.currentFile.nodes[0].formatting.y).toBe(0);
            expect($scope.currentFile.nodes[0].formatting.width).toBe(100);
            expect($scope.currentFile.nodes[0].formatting.height).toBe(100);
            expect($scope.currentFile.nodes[1].formatting.x).toBe(120);
            expect($scope.currentFile.nodes[1].formatting.y).toBe(0);
            expect($scope.currentFile.nodes[1].formatting.width).toBe(100);
            expect($scope.currentFile.nodes[1].formatting.height).toBe(100);
            expect($scope.getParent.calls.count()).toEqual(2);
        });
    });
});
