<?php

require('suit_model.php');

if (isset($_GET)) {
  $suitModel = new SuitModel();
  $suitArray = $suitModel->GetAllSuits();
  $js_array = json_encode($suitArray);
  echo $js_array;
}

?>
