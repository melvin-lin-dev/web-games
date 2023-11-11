function cvsClick(e){
	let x = e.offsetX; // Ambil lokasi mouse (dalam canvasnya)
	let y = e.offsetY;

	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			let tile = gameGrid[row][col];

			if(x >= tile.x && y >= tile.y && x < tile.x + tile.w && y < tile.y + tile.h && tile.imageType === 'pipe'){ //Cek kalau kliknya di dalam pipe dan tipe tile nya pipe
				tile.goRotate += 90; // Untuk membuat animasi jadi buat 1 variable misalnya goRotate

				resetState(); // Atur ulang statusnya
			}
		}
	}
}

function checkOutOfBound(x, y){
	return x >= 0 && y >= 0 && x < length && y < length;
}

function resetState(){ // Atur ulang statusnya
	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			gameGrid[row][col].state = 0;
		}
	}

	flows = [gameGrid[source.y][source.x]]; // Reset flows nya kalau gk nanti menumpuk

	checkFlow(); // Cek alirnya
}

function checkFlow(){ // Cek alirnya
	let checking = true;

	while(checking){ // Cek terus kalau checkingnya dalam keadaan true 
		let currentFlowsLength = flows.length; // Buat 1 variabel untuk tampung banyak flows yg sekarang ini

		flows.forEach((tile, tileIndex) => { // Loop semua flow yang sudah dipush
			tile.lines.forEach(line => { // Loop juga linenya (Bisa dibilang directionnya juga)
				let currentLine = (tile.goRotate % 360 / 90 + line) % 4, // Perhitungannya liat note
					checkLine = (currentLine + 2) % 4; // Perhitungannya liat note

				let next = {
					x: tile.x / size + dir[currentLine][0], // Buat variabel untuk tampung direksi" line ada di main.js, lebih gampang buatnya berurutan dengan urutan line
					y: tile.y / size + dir[currentLine][1]  // misalnya line 0 arah ke atas jd [[0,-1]] isi variabel dir nya
				}

				if(checkOutOfBound(next.x, next.y)){ // Cek apakah x dan y keluar batas array
					let nextTile = gameGrid[next.y][next.x], // Tile selanjutnya
						nextTileLines = nextTile.lines.map(value => (nextTile.goRotate % 360 / 90 + value) % 4); // Line selanjutnya harus dikonversikan juga dan tampung ke
																												// variabel supaya tidak mengubah value asli

					if(nextTileLines.indexOf(checkLine) + 1){ // Cek apakah line untuk cek ada didaftar line tile selanjutnya
						if(nextTile.imageType === 'pipe' && checkFlowExist(next.x, next.y)){ // Cek apakah tipenya pipe dan cek apakah tilenya sudah ada dimasukkan ke dalam flows
							nextTile.state = 1; // Ubah status tile menjadi terisi
							flows.push(nextTile); // Masukkan tile ke dalam flows
						}else if(nextTile.imageType === 'source_and_destination' && nextTile.type){ // Cek apakah pipenya sudah mencapai tujuan pipe dan tipenya 1 (Warna hitam)
							alert('You Have Won The Game');
							return false;
						}
					}
				}
			})
		})

		if(currentFlowsLength == flows.length){ // Cek apakah length nya ada perubah dengan yang sekarang ini jika tidak maka hentikan whilenya jika tidak infinity loop
			checking = false;
		}
	}
}

function checkFlowExist(x, y){ // Cek apakah x dan y sudah ada di dalam flows
	let notExist = true;

	flows.forEach(tile => {
		if(tile.x / size == x && tile.y / size == y){ // Cek dengan lokasinya
			notExist = false;
		}
	})

	return notExist;
}