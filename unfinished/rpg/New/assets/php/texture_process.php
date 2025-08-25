<?php

include("connection.php");

$action = $_POST['action'];

switch($action){
	case 'Load Page':
		$page = $_POST['page'];

		if($page == 'maps'){
			?>
				<canvas width="500" height="500"></canvas>
			<?php
		}else{
			$sql = "select * from texture";
			$query = mysqli_query($con, $sql) or die ('Error $sql');
			?>
			<div class="row texture-form pb-1">
				<div class="col-7">
					<input type="file" id="texture-name" onchange="onChangeFile(event)">
				</div>
				<div class="col-3">
					<select id="texture-pass" value="1">
						<option value="1">True</option>
						<option value="0">False</option>
					</select>
				</div>
				<div class="col-2">
					<button class="btn btn-primary" onclick="saveTexture()">Save</button>
				</div>
			</div>

			<div class="row">
			<?php
			while($re = mysqli_fetch_array($query)){
				$name = $re['name'];
				$pass = $re['pass'];
				$url = 'assets/texture/' . $name;
				?>
					<div class="col-4">
						<div class="background-image texture-image" style="background-image: url('<?= $url ?>')"></div>
						<p><span class="text-primary">Name:</span> <?= explode(".",$name)[0] ?></p>
						<p><span class="text-primary">Pass:</span> <?= $pass ?></p>
					</div>
				</div>
				<?php
			}
			?>
			</div>
			<?php
		}
		break;
	case 'Save Texture':
		$file = $_FILES['file'];
		$name = $file['name'];
		$pass = $_POST['pass'];

		$target_dir = "../texture/";
		$target_file = $target_dir . basename($name);
		move_uploaded_file($file['tmp_name'], $target_file);

		$sql = "insert into texture (name, pass) values ('$name','$pass')";
		$query = mysqli_query($con, $sql) or die ('Error $sql');
		break;
}