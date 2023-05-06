class HallwayToMainArea extends AdventureScene {
    constructor() {
        super("HallwayToMainArea", "Hallway");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("hallwayBg", "hallway.jpg");
    }
    create() {
        super.create("hallwayBg", 2.1);
    }
    onEnter() {
        this.gainItem('Simple Dagger');
        this.showMessage("Where am I?");

        let skeleton = this.createEntity("Skeleton", 1000, 667);
        skeleton.on('pointerover', () => {
                this.showMessage("Hmm this skeleton might have a key.");
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Simple Dagger")) {
                    this.showMessage("I have defeated the skeleton. It dropped a \"skeleton key\"!");
                    this.tweens.add({
                        targets: skeleton,
                        angle: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            skeleton.destroy();
                            this.time.delayedCall(50, ()=>{
                                this.spawnItem('Skeleton Key', 
                                                1000, 
                                                667, 
                                                "I can probably use this key to open the door.", 
                                                "I have \"skeleton key\" now.");
                            });
                        }
                    });
                }
                else {
                    this.showMessage("I'll need to select my \"Simple Dagger\" first and then click on the skeleton.");
                    this.tweens.add({
                        targets: skeleton,
                        x: '+=' + this.s,
                        repeat: 2,
                        yoyo: true,
                        ease: 'Sine.inOut',
                        duration: 100
                    });
                }
            })
            
        let door = this.createEntity("🚪 locked door", 520, 512);
        door.on('pointerover', () => {
                if (this.hasItem("Skeleton Key")) {
                    this.showMessage("I have the key for this door.");
                } else {
                    this.showMessage("It's locked. I need to find a key.");
                }
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Skeleton Key")) {
                    this.loseItem("Skeleton Key");
                    this.showMessage("*squeak*");
                    door.setText("Unlocked Door");
                    this.gotoScene('MainArea');
                }
                else {
                    this.showMessage("Locked. I'll need to find a key.");
                }
            });
    }
}

class MainArea extends AdventureScene {
    constructor() {
        super("MainArea", "Dark Room");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("darkRoomBg", "darkRoom.jpg");
    }
    create() {
        super.create("darkRoomBg", 2.1);
    }
    onEnter() {
        this.createDoorway("Jail Cells", 
                            64, 
                            490, 
                            "Sounds pretty empty in there", 
                            "JailCells");

        this.createDoorway("Dark Hallway", 
                            348, 
                            350, 
                            "Sounds pretty empty in there", 
                            "StoneHallway");
        
        this.createDoorway("Armory", 
                            1020, 
                            405, 
                            "Sounds pretty empty in there", 
                            "Armory");
        
        this.createDoorway("Ominous Door", 
                            660,
                            413, 
                            "Sounds pretty empty in there", 
                            "BossRoom");
        

    }
}

class JailCells extends AdventureScene {
    constructor() {
        super("JailCells", "The Cells");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("jailsBg", "jails.jpg");
    }
    create() {
        super.create("jailsBg", 2.1, this.game.config.width / 2 - this.game.config.width * 0.05);
    }
    onEnter() {
        // this.gainItem("Jail Key");
        this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "awowowow", 
                            "MainArea");

        if (this.hasInteracted("leftCell")) {
            if (this.interacted[this.interacted.length - 1] == "leftCell") {
                this.showMessage("Nothing is in there.");
            }
            let leftCell = this.createEntity("Unlocked Cell", 50, 440);
            leftCell.on('pointerdown', () => {
                    this.showMessage("There is nothing here.");
                });
        }
        else {
            let leftCell = this.createEntity("Cell", 97, 467);
            leftCell.on('pointerover', () => {
                    if (this.hasItem("Jail Key")) {
                        this.showMessage("I can open this cell.");
                    } else {
                        this.showMessage("I don't have a key for these jail cells.");
                    }
                })
                .on('pointerdown', () => {
                    if (this.holdingItem("Jail Key")) {
                        this.showMessage("*creak*");
                        leftCell.setText("Unlocked Cell").setWordWrapWidth(1);
                        this.interacted.push("leftCell");
                        this.gotoScene('JailCells', 0);
                    }
                    else {
                        this.showMessage("Locked. I'll need a key.");
                    }
                });
        }

        if (this.hasInteracted("middleCell")) {
            if (this.interacted[this.interacted.length - 1] == "middleCell") {
                this.showMessage("\"Thanks for letting me out, I will follow you around now as a gesture of thanks!\"");
            }
            let middleCell = this.createEntity("Unlocked Cell", 570, 463);
            middleCell.on('pointerover', () => {
                    if (!this.hasItem("Person's Aid")) {
                        this.showMessage("The person in there looks at you thankfully.");
                    }    
                })
                .on('pointerdown', () => {
                    if (!this.hasItem("Person's Aid")) {
                        this.showMessage("\"Thanks for letting me out, I will follow you around now as a gesture of thanks!");
                        this.gainItem("Person's Aid");
                    }
                    else {
                        this.showMessage("There is nothing here.");
                    }
                });
        }
        else {
            let middleCell = this.createEntity("Cell", 570, 463);
            middleCell.on('pointerover', () => {
                    if (this.hasItem("Jail Key")) {
                        this.showMessage("I can let this person out with my key!");
                    } else {
                        this.showMessage("why is person still in here, did they get left behind?");
                    }
                })
                .on('pointerdown', () => {
                    if (this.holdingItem("Jail Key")) {
                        this.showMessage("*creak*");
                        middleCell.setText("Unlocked Cell").setWordWrapWidth(1);
                        this.interacted.push("middleCell");
                        this.gotoScene('JailCells', 0);
                    }
                    else {
                        this.showMessage("Locked. I'll need a key.");
                    }
                });
        }

        if (this.hasInteracted("rightCell")) {
            // see if this was the most recent interacted entity
            if (this.interacted[this.interacted.length - 1] == "rightCell") {
                this.showMessage("A bat has flown out of the cell!");
            }
            let rightCell = this.createEntity("Unlocked Cell", 1202, 507);
            rightCell.on('pointerdown', () => {
                    this.showMessage("There is nothing here.");
                });

            let bat = this.createEntity("Bat", 861, 131);
            bat.on('pointerover', () => {
                    this.showMessage('*flaps*');
                    this.tweens.add({
                        targets: bat,
                        x: this.s + (this.h - 2 * this.s) * Math.random(),
                        y: this.s + (this.h - 2 * this.s) * Math.random(),
                        ease: 'Sine.inOut',
                        duration: 500
                    });
                });
        }
        else {
            let rightCell = this.createEntity("Cell", 1202, 507);
            rightCell.on('pointerover', () => {
                if (this.hasItem("Jail Key")) {
                    this.showMessage("I can open this cell.");
                } else {
                    this.showMessage("I don't have a key for these jail cells.");
                }
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Jail Key")) {
                    this.showMessage("*creak*");
                    rightCell.setText("Unlocked Cell").setWordWrapWidth(1);
                    this.interacted.push("rightCell");
                    this.gotoScene('JailCells', 0);
                }
                else {
                    this.showMessage("Locked. I'll need a key.");
                }
            });
        }
    }
}

class StoneHallway extends AdventureScene {
    constructor() {
        super("StoneHallway", "Dark Hallway");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("stoneHallwayBg", "stoneHallway.jpg");
    }
    create() {
        super.create("stoneHallwayBg", 2.1);
    }
    onEnter() {
        this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "awowowow", 
                            "MainArea");
    }
}

class Armory extends AdventureScene {
    constructor() {
        super("Armory", "Empty Armory");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("armoryBg", "armory.jpg");
    }
    create() {
        super.create("armoryBg", 2.1);
    }
    onEnter() {
        this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "awowowow", 
                            "MainArea");

        let arrow = this.add.text(200, 640, "Broken Arrow")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Broken in half."))
            .on('pointerdown', () => {
                this.showMessage("This is useless...");
                this.tweens.add({
                    targets: arrow,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });
        
        if (!this.hasItem("Sol Beam")) {
            this.spawnItem("Sol Beam", 
                            1160, 
                            415, 
                            "A spell.", 
                            "Cool");
        }

    }
}

class BossRoom extends AdventureScene {
    constructor() {
        super("BossRoom", "Throne Room");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("throneRoomBg", "throneRoom.jpg");
    }
    create() {
        super.create("throneRoomBg", 2.1);
    }
    onEnter() {
        this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "awowowow", 
                            "MainArea");
    }
}

class GuardRoom extends AdventureScene {
    constructor() {
        super("GuardRoom", "Guard Room");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("guardRoomBg", "guardRoom.jpg");
    }
    create() {
        super.create("guardRoomBg", 2.1);
    }
    onEnter() {
        this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "awowowow", 
                            "MainArea");

        // let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
        //     .setInteractive()
        //     .on('pointerover', () => {
        //         this.showMessage('*giggles*');
        //         this.tweens.add({
        //             targets: finish,
        //             x: this.s + (this.h - 2 * this.s) * Math.random(),
        //             y: this.s + (this.h - 2 * this.s) * Math.random(),
        //             ease: 'Sine.inOut',
        //             duration: 500
        //         });
        //     })
        //     .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("introBg", "startingArea.jpg");
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        this.add.image(this.w / 2, this.h / 2, "introBg").setScale(2.15);
        this.add.text(50,50, "Adventure awaits!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('HallwayToMainArea'));
        });
        
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, HallwayToMainArea, MainArea, JailCells, StoneHallway, Armory, BossRoom, GuardRoom, Outro],
    title: "Adventure Game",
});

