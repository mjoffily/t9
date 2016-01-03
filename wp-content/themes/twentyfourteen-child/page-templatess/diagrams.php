<?php /** * Template Name: Diagrams Page */ get_header(); ?>
<div class="files" ng-controller="mainCtrl">
<div id='cssmenu'>
<ul>
   <li class='active has-sub'><a href='#'><span>File</span></a>
      <ul>
         <li><a href='' ng-click="newFile()"><span>New</span></a></li>
         <li class="has-sub"><a href='#'><span>Open</span></a>
            <ul>
                <li ng-repeat="file in fileList track by $index" value="{{file.id}}"><a href="" ng-click="fileOpen($index)">{{file.file_name}}</a></li>
            </ul>
         </li>
         <li><a href='' ng-click="save()"><span>Save</span></a></li>
         <li><a href='#'><span>Save as</span></a></li>
         <li><a href='#'><span>Close</span></a></li>
      </ul>
   </li>
   <li class='has-sub'><a href='#'><span>View</span></a>
        <ul>
           <li ng-class="{checkmark: showOutline}"><a href='' ng-click="toggleOutline()"><span>Show outline</span></a></li>
           <li ng-class="{checkmark: showJson}"><a href='' ng-click="toggleJson()"><span>Show json</span></a></li>
           <li ng-class="{checkmark: debugOn}"><a href='' ng-click="toggleDebug()"><span>Debug</span></a></li>
        </ul>
   </li>
   <li class='last'><a href='#'><span>Contact</span></a></li>
</ul>
</div>
<div class="content">
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

    <div id="fileSelectContainer">
        <div id="fileName">
            <span editable-text="currentFile.file_name">{{currentFile.file_name}}</span>
        </div>

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
</div>
<?php get_footer();
