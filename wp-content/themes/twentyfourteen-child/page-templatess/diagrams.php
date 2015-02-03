<?php /** * Template Name: Diagrams Page */ get_header(); ?>
<div class="files" ng-controller="mainCtrl">
    <div id="fileSelectContainer">
    <div id="fileSelect">

        <span>Files: </span>


        <select ng-model="selectedFileIndex" ng-change="goToPage(selectedFileIndex)">
            <option value=""></option>
            <option ng-repeat="file in data track by $index" value="{{$index}}">{{file.envName}}</option>
            <option value="-1">New file</option>
        </select>
    </div>
    <div id="fileName">
        <span editable-text="currentFile.envName">{{currentFile.envName}}</span>
    </div>
    <button ng-click="save()">Save</button>

</div>
    <div ui-view></div>
</div>

<?php get_footer();
