function generatePlayers(playersData) {
    for (let id in playersData) {
        let name = playersData[id];
        let index = Object.keys(playersData).indexOf(id);

        players.push(new Player(name, index, index * 90 - 45))
        playerContainer.children[index].querySelector('.name').innerHTML = name;

        if (socket.id === id) {
            playerIndex = index;

            players[index].setIndication();
        }
    }
}

function generatePlayerStatus() {
    for (let i = 0; i < 3; i++) {
        playerContainer.appendChild(playerContainer.children[0].cloneNode(true));
    }
}

function generateInstructions() {
    let instructionEl = startContainer.querySelector('.instruction ul');

    instructions.forEach((instruction, index) => {
        let li = document.createElement('li');
        li.innerHTML = (index + 1) + '. ' + instruction;
        instructionEl.appendChild(li);

        setTimeout(() => {
            li.classList.add('active');
        }, 400 * (index + 1));
    })
}
