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

	wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style', get_stylesheet_uri(), array( 'parent-style' ) );
	
	
	// styles for t9 app
	wp_enqueue_style( 'bootstrap', get_stylesheet_directory_uri() . '/css/bootstrap.min.css');
	wp_enqueue_style( 'angularUi', get_stylesheet_directory_uri() . '/css/angular-ui-tree.min.css');
	wp_enqueue_style( 'demo', get_stylesheet_directory_uri() . '/css/demo.css');
	wp_enqueue_style( 'colorpicker', get_stylesheet_directory_uri() . '/css/colorpicker.min.css');
	wp_enqueue_style( 'ngDialog', get_stylesheet_directory_uri() . '/css/ngDialog.css');
	wp_enqueue_style( 'ngDialogTheme', get_stylesheet_directory_uri() . '/css/ngDialog-theme-default.css');
	wp_enqueue_style( 'xeditable', get_stylesheet_directory_uri() . '/css/xeditable.css');

    wp_enqueue_script( 'angular-script', get_stylesheet_directory_uri() . '/js/angular.min.js');
    wp_enqueue_script( 'angularUi-script', get_stylesheet_directory_uri() . '/js/angular-ui-tree.js');
    wp_enqueue_script( 'fabric-script', get_stylesheet_directory_uri() . '/js/fabric.js');
    wp_enqueue_script( 'colorpicker-script', get_stylesheet_directory_uri() . '/js/bootstrap-colorpicker-module.min.js');
    wp_enqueue_script( 'ngDialog-script', get_stylesheet_directory_uri() . '/js/ngDialog.js');
    wp_enqueue_script( 'xeditable-script', get_stylesheet_directory_uri() . '/js/xeditable.js');
    wp_enqueue_script( 't9-script', get_stylesheet_directory_uri() . '/js/t9.js');
    wp_localize_script( 't9-script', 'SiteParameters', $site_parameters );

}

add_action( 'wp_enqueue_scripts', 't9_scripts' );
