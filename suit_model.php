<?php
class SuitModel {
  function GetAllSuits() {
    $json = file_get_contents('./suits.json');
    $json_data = json_decode($json, true);
    
    function suits($suit) {
      return $suit[row];
    }
    $suits = array_map("suits", $json_data[0][data]);

    return $suits;
  }
}
 ?>
