<?php 

require_once 'database-connection.php';
$postdata = file_get_contents("php://input");
error_log($postdata);
$request = json_decode($postdata);
$userid = $request->user;
$fileId = $request->id;
$fileName = $request->file_name;
$maxNodeId = $request->max_node_id;
$nodes = json_encode($request->nodes);
error_log($nodes);

if ($fileId == null || $fileId == -1) {
    DB::insert('t9_files', array(
      'file_name' => $fileName,
      'userid' => $userid,
      'nodes' => $nodes,
      'max_node_id' => $maxNodeId,
      'created_date' => DB::sqleval("NOW()")
    ));
    
    $fileId = DB::insertId(); // which id did it choose?!? tell me!!
} else {
    DB::update('t9_files', array(
      'id' => $fileId,
      'file_name' => $fileName,
      'nodes' => $nodes,
      'userid' => $userid,
      'max_node_id' => $maxNodeId), "id=%i", $fileId);
}

$result = array('file_id' => $fileId);
header('Content-type: application/json');
echo json_encode($result);
?>