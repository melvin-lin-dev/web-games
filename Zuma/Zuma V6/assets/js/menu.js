let menuContainer = document.querySelector('.menu-container');
let mapContainer = document.querySelector('.map-container');
let listForm = mapContainer.querySelector('.list-form');
let maps = [];
let mapPath, mapEnd;

let menuHistories = [];
let menuAnimation = true;
let timeDelayAnimation = .3;
let pathTypes = [
    {
        type: 'M',
        name: 'Move To',
        inputs: {
            x: 0,
            y: 0,
        }
    },
    {
        type: 'L',
        name: 'Line To',
        inputs: {
            x: 0,
            y: 0,
        }
    },
    {
        type: 'S',
        name: 'Smooth Curve To',
        inputs: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
        }
    },
    {
        type: 'C',
        name: 'Curve To',
        inputs: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            x3: 0,
            y3: 0,
        }
    }
];
let designPaths = [];

let menus = {
    'multiplayer': {
        detail: {
            'create room': {
                onClick: () => {
                    showRoomLayout('create');
                }
            },
            'join room': {
                onClick: () => {
                    showRoomLayout('join');
                }
            }
        }
    },
    'map': {
        onClick: loadMaps
    }
};
let mapId;

function detailMenu(name) {
    if (!menuAnimation) {
        menuAnimation = true;

        menuHistories.push(name);

        clearMenu();

        menuContainer.querySelector('.back').classList.add('active');
    }
}

function loadMenu() {
    let currentMenus = menus;

    for (let i = 0; i < menuHistories.length; i++) {
        currentMenus = currentMenus[menuHistories[i]].detail;
    }

    for (let name in currentMenus) {
        let index = Object.keys(currentMenus).indexOf(name);

        let menu = document.createElement('li');
        menu.innerHTML = name;
        if (currentMenus[name].detail) {
            menu.onclick = () => {
                detailMenu(name)
            };
        } else {
            menu.onclick = currentMenus[name].onClick;
        }
        menu.className = 'button';
        menu.style.opacity = 0;
        menuContainer.querySelector('ul').appendChild(menu);

        setTimeout(() => {
            menu.classList.add('active');
            menu.style.opacity = 1;
        }, index * timeDelayAnimation * 1000);
    }

    setTimeout(() => {
        menuAnimation = false;
    }, (Object.keys(currentMenus).length - 1) * timeDelayAnimation);
}

function clearMenu() {
    let menuEls = [...menuContainer.querySelectorAll('li')].reverse();

    menuEls.forEach((menu, index) => {
        setTimeout(() => {
            menu.classList.remove('active');
        }, index * timeDelayAnimation * 1000);
    });

    setTimeout(() => {
        menuContainer.querySelector('ul').innerHTML = '';
        loadMenu();
    }, (menuEls.length - 1) * .7 * 1000);
}

function previousMenu() {
    menuHistories.pop();

    if (!menuHistories.length) {
        menuContainer.querySelector('.back').classList.remove('active');
    }

    clearMenu();
}

function loadMaps() {
    let listContainer = mapContainer.querySelector('.list-container');

    if (localStorage.maps) {
        maps = JSON.parse(localStorage.maps);
    }

    listContainer.innerHTML = '';

    let scale = .2;
    let designSvgRect = mapContainer.querySelector('.design-container svg').getBoundingClientRect();
    let size = {
        width: designSvgRect.width * scale,
        height: designSvgRect.height * scale
    };

    maps.forEach((map, index) => {
        let listMapContainer = document.createElement('div');
        listMapContainer.style.width = size.width + 2 + 'px';
        listMapContainer.style.height = size.height + 2 + 'px';
        listMapContainer.onclick = () => {
            editMap(index, map);
        };

        let childMapContainer = document.createElement('div');
        childMapContainer.style.width = size.width - 3 + 'px';
        childMapContainer.style.height = size.height - 3 + 'px';
        childMapContainer.className = 'child-map';

        let mapEl = mapContainer.querySelector('.design-container .map').cloneNode(true);
        mapEl.className = '';

        let endEl = mapEl.querySelector('.end');
        updatePath(map.paths, mapEl.querySelector('path'), endEl);

        let playerDesign = mapEl.querySelector('.player-design');
        playerDesign.style.left = map.player.x + 'px';
        playerDesign.style.top = map.player.y + 'px';

        let mapName = document.createElement('span');
        mapName.innerHTML = map.name;
        mapName.className = 'map-name';

        let closeButton = document.createElement('span');
        closeButton.className = 'close';
        closeButton.onclick = (e) => {
            removeMap(index);
        };

        listContainer.appendChild(listMapContainer);
        listMapContainer.appendChild(childMapContainer);
        childMapContainer.appendChild(mapEl);
        listMapContainer.appendChild(mapName);
        listMapContainer.appendChild(closeButton);
    });

    let addMapEl = document.createElement('div');
    addMapEl.className = 'add';
    addMapEl.style.width = size.width + 'px';
    addMapEl.style.height = size.height + 'px';
    addMapEl.onclick = addMap;
    listContainer.appendChild(addMapEl);

    menuContainer.classList.remove('active');
    setTimeout(() => {
        mapContainer.classList.add('active');
    }, 400);
}

function addMap() {
    listForm.innerHTML = '';
    listForm.parentNode.classList.add('active');

    addPath();
    listForm.children[0].classList.add('active');
}

function addPath(path = '') {
    let pathFormContainer = document.createElement('div');
    pathFormContainer.onclick = function () {
        selectPath(this);
    };

    let closeEl = document.createElement('span');
    closeEl.innerHTML = "&times;";
    closeEl.onclick = removePath;

    let pathName = document.createElement('div');
    pathName.className = 'path-name';

    let select = document.createElement('select');
    select.onchange = function () {
        loadInputs(pathName, this.parentNode, this.value);
    };

    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    listForm.appendChild(pathFormContainer);
    pathFormContainer.appendChild(closeEl);
    pathFormContainer.appendChild(pathName);
    pathFormContainer.appendChild(inputContainer);
    inputContainer.appendChild(select);

    pathTypes.forEach(pathType => {
        let option = document.createElement('option');
        option.innerHTML = pathType.name;
        option.value = pathType.type;
        select.appendChild(option);
    });

    if (path) {
        select.value = path.type;
    }

    loadInputs(pathName, inputContainer, select.value, path.inputs);
}

function setPlayerPosition() {
    mapContainer.querySelector('.player-design').style.left = document.getElementById('player-design-x').value + 'px';
    mapContainer.querySelector('.player-design').style.top = document.getElementById('player-design-y').value + 'px';
}

function removeMap(mapIndex) {
    maps.splice(mapIndex, 1);

    saveMap(0);
}

function removePath(e) {
    e.target.parentNode.remove();

    updateMap();
}

function editMap(index, map) {
    if (maps.indexOf(map) + 1) {
        mapContainer.querySelector('.map-name').value = map.name;

        document.getElementById('player-design-x').value = map.player.x;
        document.getElementById('player-design-y').value = map.player.y;
        setPlayerPosition();

        mapId = index + 1;

        listForm.innerHTML = '';

        map.paths.forEach(path => {
            let pathFormat = {
                type: path.type,
                inputs: {}
            };

            path.locations.forEach((location, index) => {
                let point = location.split(',');

                if (path.locations.length === 1) {
                    pathFormat.inputs = {
                        x: point[0],
                        y: point[1]
                    }
                } else {
                    pathFormat.inputs['x' + (index + 1)] = point[0];
                    pathFormat.inputs['y' + (index + 1)] = point[1];
                }
            });

            addPath(pathFormat);
        });

        listForm.parentNode.classList.add('active');
        listForm.children[0].classList.add('active');
    }
}

function loadInputs(pathName, inputContainer, type, inputs = '') {
    [...inputContainer.querySelectorAll('input')].forEach(input => input.remove());

    let pathType = pathTypes.find(pathType => pathType.type === type);

    pathName.innerHTML = pathType.name;

    for (let name in pathType.inputs) {
        let input = document.createElement('input');
        input.placeholder = name;
        input.value = inputs ? inputs[name] : 0;
        input.onkeyup = updateMap;
        input.type = 'number';
        inputContainer.appendChild(input);
    }

    updateMap();
}

function updateMap() {
    if (listForm.children.length) {
        mapEnd.classList.add('design-active');
    } else {
        mapEnd.classList.remove('design-active');
    }

    designPaths = [];

    [...listForm.children].forEach(path => {
        let locations = [];

        let inputs = path.querySelectorAll('input');
        for (let i = 0; i < inputs.length / 2; i++) {
            locations.push(inputs[i * 2].value + ',' + inputs[i * 2 + 1].value);
        }

        designPaths.push({
            type: path.querySelector('select').value,
            locations
        })
    });

    updatePath(designPaths, mapPath, mapEnd);
}

function saveMap(command = 1) {
    if (command) {
        let mapName = mapContainer.querySelector('.map-name').value;

        let mapData = {
            name: mapName ? mapName : '-',
            player: {
                x: document.getElementById('player-design-x').value,
                y: document.getElementById('player-design-y').value
            },
            paths: designPaths
        };

        if (mapId) {
            maps[mapId - 1] = mapData;

            mapId = '';
        } else {
            maps.push(mapData);
        }
    }

    designPaths = [];

    listForm.innerHTML = '';
    listForm.parentNode.classList.remove('active');

    mapContainer.querySelector('.map-name').value = '';

    document.getElementById('player-design-x').value = 0;
    document.getElementById('player-design-y').value = 0;

    updatePath([], mapPath, mapEnd);
    setPlayerPosition();

    localStorage.maps = JSON.stringify(maps);
    loadMaps();
}

function selectPath(el) {
    [...listForm.children].forEach(path => {
        path.classList.remove('active');
    });

    el.classList.add('active');
}

function exitMap() {
    mapContainer.classList.remove('active');

    menuContainer.querySelector('ul').innerHTML = '';

    setTimeout(() => {
        menuContainer.classList.add('active');

        setTimeout(() => {
            loadMenu();
        }, 400);
    }, 400);
}

function showRoomLayout(type) {
    menuContainer.classList.remove('active');

    setTimeout(() => {
        document.querySelector(`.${type}-room-container`).classList.add('active');

        if (type === 'create') {
            createRoom();
        }
    }, 400);
}

function hideRoomLayout(type) {
    document.querySelector(`.${type}-room-container`).classList.remove('active');

    menuContainer.querySelector('ul').innerHTML = '';

    setTimeout(() => {
        menuContainer.classList.add('active');

        document.querySelector(`.${type}-room-container .player-name`).value = '';

        if (type === 'create') {
            socket.emit('room_leave', {
                roomId: document.querySelector('.room-id').innerHTML
            });

            let activeMap = document.querySelector('.create-room-container .list-container > div.active');

            if (activeMap) {
                activeMap.classList.remove('active');
            }

            document.querySelector('.create-room-container .map-not-available').classList.remove('active');
            document.querySelector('.create-room-container .loader').classList.remove('active');

            document.querySelector('.room-id').classList.remove('active');
            document.querySelector('.room-id').innerHTML = '';
        } else {
            document.querySelector('.error-text').innerHTML = '';
            document.querySelector('.error-text').classList.remove('active');
        }

        setTimeout(() => {
            loadMenu();
        }, 400);
    }, 400);
}

function createRoom() {
    let lengthId = 8;
    let roomId = socket.id.substr(socket.id.length / 2 - lengthId / 2, lengthId);

    let mapLists = localStorage.maps ? JSON.parse(localStorage.maps) : [];

    let scale = .2;
    let designSvgRect = mapContainer.querySelector('.design-container svg').getBoundingClientRect();
    let size = {
        width: designSvgRect.width * scale,
        height: designSvgRect.height * scale
    };

    let listContainer = document.querySelector('.create-room-container .list-container');
    listContainer.innerHTML = '';
    listContainer.style.height = size.height + 40 + 'px';

    if (mapLists.length) {
        mapLists.forEach((map, index) => {
            let listMapContainer = document.createElement('div');
            listMapContainer.style.width = size.width + 2 + 'px';
            listMapContainer.style.height = size.height + 2 + 'px';
            listMapContainer.onclick = function () {
                chooseMap(this, roomId, JSON.stringify(map));
            };

            let childMapContainer = document.createElement('div');
            childMapContainer.style.width = size.width - 3 + 'px';
            childMapContainer.style.height = size.height - 3 + 'px';
            childMapContainer.className = 'child-map';

            let mapEl = mapContainer.querySelector('.design-container .map').cloneNode(true);
            mapEl.className = '';

            let endEl = mapEl.querySelector('.end');
            updatePath(map.paths, mapEl.querySelector('path'), endEl);

            let playerDesign = mapEl.querySelector('.player-design');
            playerDesign.style.left = map.player.x + 'px';
            playerDesign.style.top = map.player.y + 'px';

            let mapName = document.createElement('span');
            mapName.innerHTML = map.name;
            mapName.className = 'map-name';

            listContainer.appendChild(listMapContainer);
            listMapContainer.appendChild(childMapContainer);
            childMapContainer.appendChild(mapEl);
            listMapContainer.appendChild(mapName);
        });
    } else {
        setTimeout(() => {
            document.querySelector('.create-room-container .map-not-available').classList.add('active');
        }, 400);
    }
}

function chooseMap(el, roomId, map) {
    [...el.parentNode.children].forEach(mapEl => {
        mapEl.classList.remove('active');
    });

    el.classList.add('active');
    document.querySelector('.create-room-container .loader').classList.add('active');

    socket.emit('room_create', {roomId, map})
}

function joinRoom() {
    socket.emit('room_join', {
        roomId: document.querySelector('.join-room-id').value
    })
}
