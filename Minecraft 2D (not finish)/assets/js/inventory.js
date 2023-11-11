class Inventory {
    constructor() {
        this.el = document.querySelector('.inventory-container');

        this.slot = 9;
        this.mainRow = 1;
        this.sideRow = 3;

        this.mainInventory = [];
        this.sideInventory = [];

        this.maxItem = 64;
        this.minItem = 1;

        this.itemDrag = {
            mouseDown: false,
            pos: {
                x: 0, y: 0
            }
        }
    }

    generateInventory() {
        let sideInventory = document.querySelector('.inventory-container .side-inventory');
        let mainInventory = document.querySelector('.inventory-container .main-inventory');

        for (let y = 0; y < this.sideRow + this.mainRow; y++) {
            for (let x = 0; x < this.slot; x++) {
                let inventorySlot = document.createElement('div');
                inventorySlot.className = 'slot';
                if (y) {
                    sideInventory.appendChild(inventorySlot);
                    this.sideInventory.push(inventorySlot);
                } else {
                    mainInventory.appendChild(inventorySlot);
                    this.mainInventory.push(inventorySlot);
                }

                // let image = item.wood.block.image.cloneNode(true);
                // image.ondragstart = (e) => { e.preventDefault() };
                // image.onmousedown = (e) => {this.mouseDown(e)};
                // image.onmousemove = (e) => {this.mouseMove(e)};
                // image.onmouseup = (e) => {this.mouseUp(e)};
                // image.onmouseleave = (e) => {this.mouseLeave(e)};
                // inventorySlot.prepend(image);

                let count = document.createElement('span');
                count.innerHTML = 1;
                inventorySlot.appendChild(count);
            }
        }

        let inventorySlots = document.querySelectorAll('.inventory-container .slot');
        this.toggleOpen();
        let width = document.querySelector('.inventory-container .main-inventory').getBoundingClientRect().width;
        inventorySlots.forEach(inventorySlot => {
            let size = width / this.slot + 'px';
            inventorySlot.style.width = size;
            inventorySlot.style.height = size;
        });
        this.toggleOpen();
    }

    toggleOpen() {
        this.el.classList.toggle('active');
    }

    mouseDown(e) {
        if(this.el.classList.contains('active')) {
            let el = e.target.nodeName === 'IMG' ? e.target.parentNode : e.target;

            let activeSlot = document.querySelector('.inventory-container .active');
            if (activeSlot) {
                activeSlot.classList.remove('active');
            }

            el.classList.add('active');

            this.itemDrag.mouseDown = true;
            e.target.style.zIndex = 999;
            this.itemDrag.pos.x = e.clientX;
            this.itemDrag.pos.y = e.clientY;
        }
    }

    mouseMove(e){
        if(this.itemDrag.mouseDown){
            let item = e.target;
            item.style.left = item.offsetLeft - (this.itemDrag.pos.x - e.clientX) + 'px';
            item.style.top = item.offsetTop - (this.itemDrag.pos.y - e.clientY) + 'px';

            this.itemDrag.pos.x = e.clientX;
            this.itemDrag.pos.y = e.clientY;
        }
    }

    mouseUp(e){
        if(this.el.classList.contains('active') && e){
            e.target.style.display = 'none';
            let el = document.elementFromPoint(e.clientX, e.clientY);
            e.target.style.display = 'block';

            e.target.style.zIndex = 'initial';

            if(el.classList.contains('crafting-slot')){
                e.target.style.left = '50%';
                e.target.style.top = '50%';
                el.prepend(e.target.cloneNode(true));
                e.target.remove();

                formula.checkFormula('inventory');
            }else{
                e.target.style.left = '50%';
                e.target.style.top = '50%';
                e.target.style.display = 'block';
            }
        }

        this.itemDrag.mouseDown = false;
    }

    mouseLeave(e){
        this.mouseUp();
    }

    pickup(drop) {
        let availableMainSlot = false;

        this.mainInventory.forEach(inventory => {
            if (!availableMainSlot) {
                if (!inventory.children[1]) {
                    availableMainSlot = true;
                    inventory.prepend(drop.image);
                    console.log(inventory.children[0]);
                    inventory.children[0].onmousedown = this.mouseDown;
                    inventory.children[0].onmousemove = this.mouseMove;
                    inventory.children[0].onmouseup = this.mouseUp;
                    inventory.children[0].onmouseleave = this.mouseLeave;
                } else if (inventory.children[0]) {
                    if (inventory.children[0].src === drop.image.src) {
                        availableMainSlot = true;
                        inventory.children[1].innerHTML++;
                        inventory.children[1].style.display = 'block';
                    }
                }
            }
        });

        if (!availableMainSlot) {

        }
    }
}
