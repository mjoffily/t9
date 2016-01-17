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
            $scope.currentFile = {
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
            
            var count = 0;
            spyOn($scope, 'getParent').and.callFake(function() {
                count++;
                if (count === 1) {
                    return undefined;
                } else if (count === 2) {
                    return $scope.currentFile.nodes[0];
                } else if (count === 3) {
                    return $scope.currentFile.nodes[0].children[0];
                }
            });
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

        it('Level 0 - correct x, y, width, height coordinates when adding a two nodes to a blank canvas with a margin greater than zero', function() {

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

        it('Level 0 - margin is taken into account on nodes after a line break', function() {

            var a = {
                id: 1,
                type: 'node',
                title: 'test',
                formatting: {
                    width: 100,
                    height: 100,
                    marginLeft: 0,
                    marginRight: 0
                },
                metadata: [],
                children: []
            };
            var b = {
                id: 2,
                type: 'formatting',
                formatting: {
                    width: 10,
                    height: 10,
                },
                metadata: [],
                children: []
            };
            var c = {
                id: 2,
                type: 'node',
                title: 'test',
                formatting: {
                    width: 100,
                    height: 100,
                    marginLeft: 150,
                    marginRight: 0,
                },
                metadata: [],
                children: []
            };

            $scope.currentFile.nodes.splice(0, 0, a, b, c);

            $scope.calculateWidthHeightAndX();
            expect($scope.currentFile.nodes[0].formatting.x).toBe(0);
            expect($scope.currentFile.nodes[0].type).toBe("node");
            expect($scope.currentFile.nodes[1].type).toBe("formatting");
            expect($scope.currentFile.nodes[2].type).toBe("node");
            expect($scope.currentFile.nodes[2].formatting.x).toBe(150);
        });

        it('Level 1 - correct x, y, width, height coordinates of a child, with a margin greater than zero, to a parent node ', function() {

            var a = {
                id: 1,
                type: 'node',
                title: 'test',
                formatting: {
                    width: 100,
                    height: 100,
                    marginLeft: 0,
                    marginRight: 0
                },
                metadata: [],
                children: [{
                    id: 2,
                    type: 'node',
                    title: 'test',
                    formatting: {
                        width: 100,
                        height: 100,
                        marginLeft: 50,
                        marginRight: 0,
                    },
                    metadata: [],
                    children: []
                }]
            };

            $scope.currentFile.nodes.splice(0, 0, a);

            $scope.calculateWidthHeightAndX();
            expect($scope.currentFile.nodes[0].formatting.x).toBe(0);
            expect($scope.currentFile.nodes[0].children[0].formatting.x).toBe(50);
            expect($scope.getParent.calls.count()).toEqual(1);
        });

        it('Level 2 - correct x, y, width, height coordinates for 3 levels of nested elements. Each node has 100 as marginLeft ', function() {

            var a = {
                    id: 11,
                    type: 'node',
                    formatting: {
                        width: 100,
                        height: 100,
                        marginLeft: 100,
                        marginRight: 0,
                        level: 0,
                        line: 0
                    },
                    metadata: [],
                    children: [{
                        id: 13,
                        type: 'node',
                        formatting: {
                            width: 100,
                            height: 100,
                            marginLeft: 100,
                            marginRight: 0,
                            level: 1,
                        },
                        metadata: [],
                        children: [{
                            id: 12,
                            type: 'node',
                            title: 12,
                            formatting: {
                                width: 100,
                                height: 100,
                                marginLeft: 100,
                                marginRight: 0,
                                level: 2,
                            },
                            metadata: [],
                            children: []
                        }]
                    }]
            };

            $scope.currentFile.nodes.splice(0, 0, a);

            $scope.calculateWidthHeightAndX(); 
            expect($scope.currentFile.nodes[0].formatting.x).toBe(100);
            expect($scope.currentFile.nodes[0].children[0].formatting.x).toBe(200);
            expect($scope.currentFile.nodes[0].children[0].children[0].formatting.x).toBe(300);
            expect($scope.getParent.calls.count()).toEqual(2);
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
    });
});
