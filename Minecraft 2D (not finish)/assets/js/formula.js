class Formula {
    constructor() {
        this.formulas = [
            {
                materials: [
                    ['wood']
                ],
                result: 'plank-wood'
            }
        ];
    }

    checkFormula(craftType) {
        let craft = document.querySelector(`.${craftType}-container .crafting-area`);
        let formulaFound = false;

        this.formulas.forEach(formula => {
            if (craft.children.length >= formula.materials.length) {
                let correctFormula = true;

                [...craft.children].forEach((craftRow, row) => {
                    [...craftRow.children].forEach((material, col) => {
                        material =  material.children[0];

                        let craftMaterial = formula.materials[row];

                        if(craftMaterial && material){
                            craftMaterial = craftMaterial[col];

                            if (material) {
                                material = convertImageToType(material);

                                if (material !== craftMaterial) {
                                    correctFormula = false;
                                }
                            }
                        }
                    });
                });

                if (correctFormula) {
                    formulaFound = true;
                    let result = item[formula.result].block.image;
                    result.ondragstart = (e) => { e.preventDefault() };
                    result.onmousedown = (e) => {inventory.mouseDown(e)};
                    result.onmousemove = (e) => {inventory.mouseMove(e)};
                    result.onmouseup = (e) => {inventory.mouseUp(e)};
                    result.onmouseleave = (e) => {inventory.mouseLeave(e)};
                    document.querySelector('.craft-result').appendChild(result);
                }
            }
        });

        if (!formulaFound) {
            document.querySelector('.craft-result').innerHTML = '';
        }
    }
}
