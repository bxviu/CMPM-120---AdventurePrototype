class AdventureScene extends Phaser.Scene {

    init(data) {
        this.inventory = data.inventory || [];
        this.interacted = data.interacted  || [];
        this.heldItem = null;
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
            console.log(bgx);
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
            this.heldItem.setPosition(x - this.heldItem.width/2, y);
        } 
        else {
            this.input.setDefaultCursor('default');
        }
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
            h += text.height + this.s;
            this.inventoryTexts.push(text);
        });
    }
    
    returnItem(item) {
        // let temp = this.heldItem;
        this.heldItem = null;   
        // this.updateInventory();
        // this.returnItem(temp);
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
                        // item.setInteractive();
                        this.updateInventory();
                    }
                });
            }
        });
    }

    spawnItem(itemName, x, y, pointerOverText, pointerDownText) {
        let item = this.add.text(x, y, itemName).setFontSize(this.s * 2);
        this.tweens.add({
            targets: item,
            y: `+=${2 * this.s}`,
            alpha: { from: 0, to: 1 },
            duration: 500,
            onComplete: () => {
                item.setInteractive()
                    .on('pointerover', () => {
                        this.showMessage(pointerOverText)
                    })
                    .on('pointerdown', () => {
                        this.showMessage(pointerDownText);
                        this.gainItem(itemName);
                        this.tweens.add({
                            targets: item,
                            y: `-=${2 * this.s}`,
                            alpha: { from: 1, to: 0 },
                            duration: 500,
                            onComplete: () => item.destroy()
                        });
                    })
            }
        });
    }

    createDoorway(text, x, y, overText, scene) {
        this.add.text(x, y, text)
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage(overText);
            })
            .on('pointerdown', () => {
                this.gotoScene(scene);
            });
    }

    createEntity(text, x, y, txtColor="#00FFF0") {
        let entity = this.add.text(x, y, text, {color:txtColor,})
            .setFontSize(this.s * 2)
            .setInteractive()
            .setWordWrapWidth(1).setAlign('center');
        return entity
    }

    itemGrabbed(item) {
        if (this.heldItem != null) {
            this.returnItem(this.heldItem);
        }
        console.log("holding " + item.text);
        this.heldItem = item;
        item.disableInteractive();
        this.input.setDefaultCursor('none');
    }

    holdingItem(item) { 
        if (this.heldItem == null) {
            return false;
        }
        return this.heldItem.text == item;
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
            this.scene.start(key, { inventory: this.inventory, interacted:this.interacted });
        });
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }
}