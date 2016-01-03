<?php 

require_once 'database-connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
error_log($postdata);
error_log(print_r($request));
$userid = $request->user;
$fileId = $request->id;
$fileName = $request->file_name;
$maxNodeId = $request->max_node_id;
$svgWidth = $request->svg_width;
$svgHeight = $request->svg_height;
error_log($fileName);
$nodes = json_encode($request->nodes);
error_log($nodes);

if ($fileId == null || $fileId == -1) {
    DB::insert('t9_files', array(
      'file_name' => $fileName,
      'userid' => $userid,
      'nodes' => $nodes,
      'max_node_id' => $maxNodeId,
      'svg_width' => $svgWidth,
      'svg_height' => $svgHeight,
      'created_date' => DB::sqleval("NOW()")
    ));
    
    $fileId = DB::insertId(); // which id did it choose?!? tell me!!
} else {
    DB::update('t9_files', array(
      'id' => $fileId,
      'file_name' => $fileName,
      'nodes' => $nodes,
      'userid' => $userid,
      'svg_width' => $svgWidth,
      'svg_height' => $svgHeight,
      'max_node_id' => $maxNodeId), "id=%i", $fileId);
}

$result = array('file_id' => $fileId);
header('Content-type: application/json');
echo json_encode($result);
?>