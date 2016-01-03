<?php
require_once 'database-connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userid = $request->user;
$fileId = $request->id;


$file = DB::queryFirstRow("SELECT id, file_name, max_node_id, svg_width, svg_height, nodes
                        FROM t9_files 
                       WHERE userid=%s and id=%i", $userid, $fileId);
header('Content-type: application/json');


$decodedNodes = json_decode($file['nodes']);
$file['nodes'] = $decodedNodes;
error_log("width -->" + $file['svg_width']);
echo json_encode($file);
?>