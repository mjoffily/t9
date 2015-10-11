<?php
require_once 'database-connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userid = $request->user;
$fileId = $request->id;
error_log($postdata);

$file = DB::queryFirstRow("SELECT id, file_name, max_node_id, nodes
                        FROM t9_files 
                       WHERE userid=%s and id=%i", $userid, $fileId);
header('Content-type: application/json');


$decodedNodes = json_decode($file['nodes']);
$file['nodes'] = $decodedNodes;
echo json_encode($file);
?>