<?php /** * Template Name: Diagrams Page * * @package WordPress * @subpackage Twenty_Fourteen * @since Twenty Fourteen 1.0 */ get_header(); ?>
<div class="files" ng-controller="treeCtrl" >
    <span>Files: </span>
    <ul class="nav nav-tabs">
        <li ng-repeat="node in data">
            <a class="page-item" ui-sref="home.file.diagram({idx: $index})">{{node.envName}}</a>
        </li>
        <li>
            <a class="page-item" ng-click="newFile()" href="#">New file</a>
        </li>
    </ul>
<div ui-view></div>
</div>

<?php get_footer();
