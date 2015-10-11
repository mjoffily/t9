<?php /** * Template Name: Diagrams Page */ get_header(); ?>
        <script type="text/ng-template" id="loginn.html">
            <div class="modal-header">
                <h3 class="modal-title">I'm a modal!</h3>
            </div>
            <div class="modal-body">
                <ul>
                    <li ng-repeat="item in items">
                        <a href="#" ng-click="$event.preventDefault(); selected.item = item">{{ item }}</a>
                    </li>
                </ul>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
                <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
            </div>
        </script>

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
                    <li ng-repeat="file in fileList track by $index" value="{{file.id}}"><a href="" ng-click="fileOpen($index)">{{file.file_name}}</a>
                    </li>
                    <li class="divider"></li>
                    <li><a href="" ng-click="newFile()">New File</a>
                    </li>
                </ul>
            </div>

        </div>
        <div id="fileName">
            <span editable-text="currentFile.file_name">{{currentFile.file_name}}</span>
        </div>

        <button type="button" class="btn btn-default" aria-label="Left Align" ng-click="save()">
            <span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
        </button>
        <div id="login-and-register">
            <button type="button" class="btn btn-default" aria-label="Left Align" ng-click="login()">
                <span class="glyphicon glyphicon-log-in" aria-hidden="true"></span>
            </button>
        </div>

    </div>
    <div class="col-md-3">
        <div class="pull-right">
            <img class="spinner" ng-show="loading" src="<?php bloginfo('stylesheet_directory'); ?>/images/spinner.GIF" />
        </div>

    </div>
    <div ui-view></div>
</div>

<?php get_footer();
