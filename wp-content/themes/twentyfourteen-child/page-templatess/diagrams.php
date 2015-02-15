<?php /** * Template Name: Diagrams Page */ get_header(); ?>
<div class="files" ng-controller="mainCtrl">
    <div id="fileSelectContainer">
        <div id="fileSelect">

            <div class="btn-group" dropdown>
                <button type="button" class="btn btn-danger">Files</button>
                <button type="button" class="btn btn-danger dropdown-toggle" dropdown-toggle>
                    <span class="caret"></span>
                    <span class="sr-only">Split button!</span>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li ng-repeat="file in data track by $index" value="{{$index}}"><a href="" ng-click="goToPage($index)">{{file.envName}}</a>
                    </li>
                    <li class="divider"></li>
                    <li><a href="#">New File</a>
                    </li>
                </ul>
            </div>

        </div>
        <div id="fileName">
            <span editable-text="currentFile.envName">{{currentFile.envName}}</span>
        </div>

        <button type="button" class="btn btn-default" aria-label="Left Align" ng-click="save()">
            <span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
        </button>

    </div>
    <div ui-view></div>
</div>

<?php get_footer();
