function generateBoard() {
    for (let y = 0; y < tileLength; y++) {
        gameBoard.push([]);
        pawns.push([]);
        for (let x = 0; x < tileLength; x++) {
            let tileX = x * tileSize;
            let tileY = y * tileSize;

            gameBoard[y].push(new Tile(tileX, tileY));
            pawns[y].push('');
        }
    }
}

function generatePawnSelectList() {
    let chessPawnSelect = document.querySelector('.chess-pawn-select');
    let size = chessPiecesImg.width / 6;

    pawnSelectList.forEach((type, index) => {
        let typeNumber = type === 'queen' ? index : index + 1;

        let imageContainer = document.createElement('div');
        imageContainer.style.backgroundPosition = `${-size * typeNumber}px ${-size * (turn === 'white')}px`;
        imageContainer.style.height = `${size}px`;
        imageContainer.style.width = `${size}px`;
        imageContainer.onclick = () => {
            pawnSelectClick(typeNumber)
        };

        chessPawnSelect.appendChild(imageContainer);
    })
}
