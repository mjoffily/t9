<?php

/**
 * Enqueue scripts and styles for the front end.
 *
 * @since Twenty Fourteen 1.0
 */


function t9_scripts() {
    $site_parameters = array(
    'site_url' => get_site_url(),
    'theme_directory' => get_stylesheet_directory_uri()
    );

	
	
	// styles for t9 app
	wp_enqueue_style( 'bootstrap', get_stylesheet_directory_uri() . '/css/bootstrap.min.css');
//	wp_enqueue_style( 'angularUi', get_stylesheet_directory_uri() . '/css/angular-ui-tree.min.css');
	wp_enqueue_style( 'colorpicker', get_stylesheet_directory_uri() . '/css/colorpicker.min.css');
//	wp_enqueue_style( 'ngDialog', get_stylesheet_directory_uri() . '/css/ngDialog.css');
//	wp_enqueue_style( 'ngDialogTheme', get_stylesheet_directory_uri() . '/css/ngDialog-theme-default.css');
	wp_enqueue_style( 'xeditable', get_stylesheet_directory_uri() . '/css/xeditable.css');
    wp_enqueue_style( 'child-style', get_stylesheet_uri(), array( 'parent-style' ) );
    wp_enqueue_style( 'angular-material', 'https://ajax.googleapis.com/ajax/libs/angular_material/0.8.2/angular-material.min.css' );

   wp_enqueue_script( 'hammerjs', "https://cdn.jsdelivr.net/hammerjs/2.0.4/hammer.min.js");
   wp_enqueue_script( 'angular-script', "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.min.js");
   wp_enqueue_script( 'angular-animate', "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-animate.min.js");
   wp_enqueue_script( 'angular-aria', "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-aria.min.js");
   wp_enqueue_script( 'angular-material', "https://ajax.googleapis.com/ajax/libs/angular_material/0.8.2/angular-material.js");
    
    //wp_enqueue_script( 'angular-script', get_stylesheet_directory_uri() . '/js/_lib/angular.js');
//    wp_enqueue_script( 'angularUi-script', get_stylesheet_directory_uri() . '/js/_lib/angular-ui-tree.js');
    wp_enqueue_script( 'angular-ui-router-script', get_stylesheet_directory_uri() . '/js/_lib/angular-ui-router.js');
    wp_enqueue_script( 'angular-ui-bootstrap-script', get_stylesheet_directory_uri() . '/js/_lib/ui-bootstrap-tpls-0.12.0.js');
    wp_enqueue_script( 'angular-modal-service-script', get_stylesheet_directory_uri() . '/js/_lib/angular-modal-service.js');
//    wp_enqueue_script( 'fabric-script', get_stylesheet_directory_uri() . '/js/_lib/fabric.js');
    wp_enqueue_script( 'colorpicker-script', get_stylesheet_directory_uri() . '/js/_lib/bootstrap-colorpicker-module.min.js');
//    wp_enqueue_script( 'ngDialog-script', get_stylesheet_directory_uri() . '/js/_lib/ngDialog.js');
    wp_enqueue_script( 'xeditable-script', get_stylesheet_directory_uri() . '/js/_lib/xeditable.js');
    wp_enqueue_script( 'd3-script', get_stylesheet_directory_uri() . '/js/_lib/d3.js');
    wp_enqueue_script( 't9-script', get_stylesheet_directory_uri() . '/js/t9.js');
    wp_enqueue_script( 'services-script', get_stylesheet_directory_uri() . '/js/services/services.js');
    wp_enqueue_script( 'diagram-controller-script', get_stylesheet_directory_uri() . '/js/controller/DiagramD3Ctrl.js');
    wp_enqueue_script( 'file-controller-script', get_stylesheet_directory_uri() . '/js/controller/FileCtrl.js');
    wp_enqueue_script( 'main-controller-script', get_stylesheet_directory_uri() . '/js/controller/MainCtrl.js');
    wp_enqueue_script( 'flat-view-controller-script', get_stylesheet_directory_uri() . '/js/controller/FlatViewCtrl.js');
    wp_enqueue_script( 'login-controller-script', get_stylesheet_directory_uri() . '/js/controller/LoginCtrl.js');
    wp_enqueue_script( 'directives-script', get_stylesheet_directory_uri() . '/js/directives/directives.js');
    wp_enqueue_script( 'node-properties-directive-script', get_stylesheet_directory_uri() . '/js/directives/node-properties.js');
    
    wp_localize_script( 't9-script', 'SiteParameters', $site_parameters );

}

add_action( 'wp_enqueue_scripts', 't9_scripts' );
