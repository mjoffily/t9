<?php 

require_once 'meekrodb.2.3.class.php';
DB::$user = getenv('C9_USER');
DB::$host = getenv('IP');
DB::$password = '';
DB::$dbName = 'c9';
DB::$port = 3306;
?>