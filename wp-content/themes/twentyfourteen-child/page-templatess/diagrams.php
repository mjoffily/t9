<?php
/**
 * Template Name: Diagrams Page
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */

get_header(); ?>

<div ng-app="treeApp" ng-controller="treeCtrl">

  <div class="container">
    <h1 class="page-header">Tree - demo</h1>
    <a href="index.html"><i class="glyphicon glyphicon-chevron-left"></i> Back to overview page</a>

  
</div>

    <div class="row">
      <div class="top-header">
        <h3>Tree view</h3>
          <a href="" class="btn btn-default " ng-click="draw()">Draw</a>
          <a href="" class="btn btn-default " ng-click="collapseAll()">Collapse all</a>
          <a href="" class="btn btn-default " ng-click="expandAll()">Expand all</a>
          <a href="" class="btn btn-default " ng-click="addNewNode()">Add new node</a>
          <a href="" class="btn btn-default " ng-click="addNewLineBreak()">Add new LB</a>
          <a href="" class="btn btn-default " ng-click="moveLastToTheBeginning()">LtoB</a>
          <a href="" class="btn btn-default " ng-click="toggleJson()">Json</a>
</div>
      <div class="col-lg-2">


        <!-- Nested node template -->
        <script type="text/ng-template" id="nodes_renderer.html">
          <div ui-tree-handle class="tree-node tree-node-content">
            <a class="btn btn-success btn-xs" ng-if="node.nodes && node.nodes.length > 0" nodrag ng-click="toggle(this)"><span class="glyphicon" ng-class="{'glyphicon-chevron-right': collapsed, 'glyphicon-chevron-down': !collapsed}"></span></a>
            {{node.title}}
            <a class="pull-right btn btn-danger btn-xs" nodrag ng-click="remove(this)"><span class="glyphicon glyphicon-remove"></span></a>
            <a class="pull-right btn btn-primary btn-xs" nodrag ng-click="newSubItem(this)" style="margin-right: 8px;"><span class="glyphicon glyphicon-plus"></span></a>
            <a class="pull-right btn btn-primary btn-xs" nodrag ng-click="clickToOpen(this)" style="margin-right: 8px;"><span class="glyphicon glyphicon-plus"></span></a>
            <a class="pull-right btn btn-primary btn-xs" nodrag ng-click="changeText()" style="margin-right: 8px;"><span class="glyphicon glyphicon-plus"></span></a>
          </div>
          <ol ui-tree-nodes="" ng-model="node.children" ng-class="{hidden: collapsed}">
            <li ng-repeat="node in node.children" ui-tree-node ng-include="'nodes_renderer.html'">
            </li>
          </ol>
        </script>
        <div ui-tree id="tree-root">
          <ol ui-tree-nodes ng-model="data">
            <li ng-repeat="node in data" ui-tree-node ng-include="'nodes_renderer.html'"></li>
          </ol>
        </div>
      </div>

      <div class="col-lg-2" ng-show="showJson">
        <h3>Data binding</h3>
        <div class="info">
            {{info}}
        </div>
        <pre class="code">{{ data | json }}</pre>
      </div>
	  <div class="col-lg-6">
		<canvas id="c" width="1500" height="1500" ></canvas>
		</div>
    </div>

  </div>

</div>

<?php
get_footer();
