<?php

include "connection.php";

$sql = "insert into map (stage, code) values ('$stage','$code')";
$query = mysqli_query($con,$sql) or die ("Error $sql");

header('location: ../../index.php');