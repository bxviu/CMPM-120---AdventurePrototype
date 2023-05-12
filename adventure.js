class AdventureScene extends Phaser.Scene {

    init(data) {
        this.inventory = data.inventory || [];
        this.interacted = data.interacted  || [];
        this.heldItem = null;
        this.hoverOverVisual = [];
        this.removeHoverOverVisual = [];
    }

    constructor(key, name) {
        super(key);
        this.name = name;
    }

    create(backgroundImage, scale = 2.15, bgx = this.game.config.width / 2 - this.game.config.width * 0.1, bgy = this.game.config.height / 2) {
        this.transitionDuration = 1000;

        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        if (backgroundImage) {    
            this.add.image(bgx, bgy, backgroundImage).setScale(scale);
        }

        this.cameras.main.setBackgroundColor('#444');
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.rectangle(this.w * 0.75, 0, this.w * 0.25, this.h).setOrigin(0, 0).setFillStyle(0);
        this.add.text(this.w * 0.75 + this.s, this.s)
            .setText(this.name)
            .setStyle({ fontSize: `${3 * this.s}px` })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);
        
        this.messageBox = this.add.text(this.w * 0.75 + this.s, this.h * 0.33)
            .setStyle({ fontSize: `${2 * this.s}px`, color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.inventoryBanner = this.add.text(this.w * 0.75 + this.s, this.h * 0.66)
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setText("Inventory")
            .setAlpha(0);

        this.inventoryTexts = [];
        this.updateInventory();

        this.add.text(this.w-3*this.s, this.h-3*this.s, "📺")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.showMessage('Fullscreen?'))
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });

        // to hold items
        let one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        let {x,y,isDown} = this.input.activePointer;
        this.mousex = x;
        this.mousey = y;
        one.on('down', () => {
            console.log(this.mousex, this.mousey);
        });
        this.input.on('pointerdown', (event) => {
            if (this.heldItem != null) {
                this.returnItem(this.heldItem);
            } 
        });

        this.onEnter();

    }

    update() {
        let {x,y,isDown} = this.input.activePointer;
        this.mousex = x;
        this.mousey = y;
        if (this.heldItem != null) {
            this.heldItem.setPosition(x - this.heldItem.width/2, y - this.heldItem.height/2);
        } 
        else {
            this.input.setDefaultCursor('default');
        }
        this.hoverOverVisual.forEach(element => {
            if (element.alpha < 1) {
                element.setAlpha(element.alpha + 0.05);
            }
            if (element.alpha > 1) {
                this.hoverOverVisual.splice(this.hoverOverVisual.indexOf(element), 1);
                element.setAlpha(1);
            }
        });
        this.removeHoverOverVisual.forEach(element => {
            if (element.alpha > 0.1) {
                element.setAlpha(element.alpha - 0.05);
            }
            if (element.alpha < 0.1) {
                this.removeHoverOverVisual.splice(this.removeHoverOverVisual.indexOf(element), 1);
                element.setAlpha(0.1);
            }
        });
    }

    showMessage(message) {
        this.messageBox.setText(message);
        this.tweens.add({
            targets: this.messageBox,
            alpha: { from: 1, to: 0 },
            easing: 'Quintic.in',
            duration: 4 * this.transitionDuration
        });
    }

    updateInventory() {
        if (this.inventory.length > 0) {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 1,
                duration: this.transitionDuration
            });
        } else {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 0,
                duration: this.transitionDuration
            });
        }
        if (this.inventoryTexts) {
            this.inventoryTexts.forEach((t) => t.destroy());
        }
        this.inventoryTexts = [];
        let h = this.h * 0.66 + 3 * this.s;
        this.inventory.forEach((e, i) => {
            let text = this.add.text(this.w * 0.75 + 2 * this.s, h, e)
                .setStyle({ fontSize: `${1.5 * this.s}px` })
                .setWordWrapWidth(this.w * 0.75 + 4 * this.s)
                .setInteractive();
            text.on('pointerdown', (event) => {if (this.heldItem == null) {this.itemGrabbed(text)}})
            text.preFX.addGlow("#000000");
            h += text.height + this.s;
            this.inventoryTexts.push(text);
        });
    }
    
    returnItem(item) {
        this.heldItem = null;  
        this.tweens.add({
            targets: item,
            angle: {from: -5, to: 5},
            duration: 250,
            onComplete: () => { 
                let h = this.h * 0.66 + 3 * this.s;
                this.tweens.add({
                    targets: item,
                    x: {from: this.mousex,  to: this.w * 0.75 + 2 * this.s},
                    y: {from: this.mousey,  to: h + item.height + this.s},
                    duration: 250,
                    onComplete: () => {
                        this.updateInventory();
                    }
                });
            }
        });
    }

    spawnItem(itemName, x, y, pointerOverText, pointerDownText, txtColor="#FFFF00") {
        let itemContainer = this.add.container(x, y);
        let item = this.add.text(0, 0, itemName, {color:txtColor,}).setFontSize(this.s * 2);
        item.preFX.addGlow("#FF0000");
        let itemArea = this.addBox(item.width/2, item.height/2, item.width+30, item.height*1.5, 0xffef5c, 0.5, null);
        itemContainer.add([item, itemArea]);
        this.tweens.add({
            targets: itemContainer,
            y: `+=${2 * this.s}`,
            alpha: { from: 0, to: 1 },
            duration: 500,
            onComplete: () => {
                itemContainer.list[1].on('pointerover', () => {
                        this.showMessage(pointerOverText)
                        this.checkVisual(itemContainer.list[1]);
                    })
                    .on('pointerdown', () => {
                        this.showMessage(pointerDownText);
                        this.gainItem(itemName);
                        this.tweens.add({
                            targets: itemContainer,
                            y: `-=${2 * this.s}`,
                            alpha: { from: 1, to: 0 },
                            duration: 500,
                            onComplete: () => itemContainer.destroy()
                        });
                    })
            }
        });
        return itemContainer;
    }

    checkVisual(item) {
        if (!this.hoverOverVisual.includes(item)) {
            this.hoverOverVisual.push(item);
        }
    }

    checkRemoveVisual(item) {                
        if (this.hoverOverVisual.includes(item)) {
            this.hoverOverVisual.splice(this.hoverOverVisual.indexOf(item), 1);
        }
        if (!this.removeHoverOverVisual.includes(item)) {
            this.removeHoverOverVisual.push(item);
        }
    }

    addBox(x, y, w, h, color, maxAlpha, overText, scene) {
        let box = this.add.rexRoundRectangle(x, y, w, h, 30, color, maxAlpha);
        box.setDepth(0);
        box.alpha = 0.1;
        box.setInteractive();
        if (overText != null) {
            box.on('pointerover', () => {
                this.showMessage(overText);
                this.checkVisual(box);
            })
            .on('pointerdown', () => {
                this.gotoScene(scene);
            })
        }
        box.on('pointerout', () => {
                this.checkRemoveVisual(box);
            });
        return box;
    }

    createDoorway(text, x, y, overText, scene, txtColor="#FFA500") {
        let doorContainer = this.add.container(x, y);
        let doorway = this.add.text(0, 0, text, {color:txtColor,})
            .setFontSize(this.s * 2);
        doorway.preFX.addGlow("#FF0000");
        let doorwayArea = this.addBox(doorway.width/2, doorway.height/2, doorway.width+30, doorway.height*1.5, 0xEEF084, 0.5, overText, scene);
        doorContainer.add([doorway, doorwayArea]);
        return doorContainer;
    }

    createEntity(text, x, y, txtColor="#90ee90") {
        let entityContainer = this.add.container(x, y);
        let entity = this.add.text(0, 0, text, {color:txtColor,})
            .setFontSize(this.s * 2)
            .setWordWrapWidth(1).setAlign('center');
        entity.preFX.addGlow("#FF0000");
        let entityArea = this.addBox(entity.width/2, entity.height/2, entity.width+30, entity.height*1.5, txtColor=="#90ee90" ? 0x7cd9af : txtColor, 0.5, null);
        entityContainer.add([entity, entityArea]);
        return entityContainer;
    }

    itemGrabbed(item) {
        if (this.heldItem != null) {
            this.returnItem(this.heldItem);
        }
        // console.log("holding " + item.text);
        this.heldItem = item;
        item.disableInteractive();
        this.input.setDefaultCursor('crosshair');
    }

    holdingItem(item) { 
        return item == "any" ? 
                this.heldItem != null : item == null ? 
                    true : this.heldItem == null ? 
                        false : this.heldItem.text == item;
    }

    hasInteracted(entity) {
        return this.interacted.includes(entity);
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }

    gainItem(item) {
        if (this.heldItem != null) {
            this.returnItem(this.heldItem);
        }
        if (this.inventory.includes(item)) {
            console.warn('gaining item already held:', item);
            return;
        }
        this.inventory.push(item);
        this.updateInventory();
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x - 20, to: text.x },
                    alpha: { from: 0, to: 1 },
                    ease: 'Cubic.out',
                    duration: this.transitionDuration
                });
            }
        }
    }

    loseItem(item) {
        if (!this.inventory.includes(item)) {
            console.warn('losing item not held:', item);
            return;
        }
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x, to: text.x + 20 },
                    alpha: { from: 1, to: 0 },
                    ease: 'Cubic.in',
                    duration: this.transitionDuration
                });
            }
        }
        this.time.delayedCall(500, () => {
            this.inventory = this.inventory.filter((e) => e != item);
            this.updateInventory();
        });
    }

    gotoScene(key, transitionTime = this.transitionDuration) {
        this.cameras.main.fade(transitionTime, 0, 0, 0);
        this.time.delayedCall(transitionTime, () => {
            console.log(this.children.list);
            this.children.list.forEach(x => x.destroy());
            this.scene.start(key, { inventory: this.inventory, interacted:this.interacted });
        });
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }
}