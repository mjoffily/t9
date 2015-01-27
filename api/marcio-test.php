<?php
/** Sets up the WordPress Environment. */
require( dirname(__FILE__) . '/../wp-load.php' );


class diagram_api
{
	function __construct() 
	{
	}
	
	static function get_result_search()
	{
		$arr = [];
		 if ( is_user_logged_in() ) {
			 $arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5, 'USER-IN' => 'yes');
		 } else {
			 $arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5, 'USER-IN' => 'NO');
		 }
   		echo json_encode($arr);
	}
}

$e = new diagram_api();
diagram_api::get_result_search();
?>