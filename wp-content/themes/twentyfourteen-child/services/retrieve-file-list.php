<?php 

require_once 'database-connection.php';
$postdata = file_get_contents("php://input");
error_log($postdata);
$request = json_decode($postdata);
$userid = $request->user;
$results = DB::query("SELECT id, file_name FROM t9_files WHERE userid=%s", $userid);
header('Content-type: application/json');
echo json_encode(array('files'=>$results));

?>