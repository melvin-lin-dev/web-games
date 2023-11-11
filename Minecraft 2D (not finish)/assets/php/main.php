<?php

error_reporting(0);

$directoryPath = '../images';
$directories = array_splice(scandir($directoryPath), 2);

$allowed = ['block', 'drop'];

$files = [];

foreach($directories as $directory){
    if(in_array($directory, $allowed)){
        $filePath = $directoryPath . '/' . $directory;
        $files[$directory] = array_splice(scandir($filePath), 2);
    }
}

echo json_encode($files);

//echo '<pre>'.var_export($files, true).'</pre>';
