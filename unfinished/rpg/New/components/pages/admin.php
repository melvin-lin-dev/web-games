<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>RPG</title>

	<link rel="stylesheet" href="assets/css/grid.css">
	<link rel="stylesheet" href="assets/css/style.css">

	<script src="assets/js/jquery.js"></script>
	<script src="assets/js/admin.js"></script>
</head>
<body>
	<ul>
		<li onclick="loadPage(this.innerHTML)">Maps</li>
		<li onclick="loadPage(this.innerHTML)">Textures</li>
	</ul>

	<div id="page" class="page"></div>
	<!-- 
	<script src="assets/js/main.js"></script>
	<script src="assets/js/key.js"></script>
	<script src="assets/js/board.js"></script>
	
	<script src="assets/js/update.js"></script>
	<script src="assets/js/check.js"></script>
	<script src="assets/js/player.js"></script>
	<script src="assets/js/render.js"></script>
	<script src="assets/js/block.js"></script> -->
</body>
</html>