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
        // let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
        //     .setFontSize(this.s * 2)
        //     .setInteractive()
        //     .on('pointerover', () => this.showMessage("Metal, bent."))
        //     .on('pointerdown', () => {
        //         this.showMessage("No touching!");
        //         this.tweens.add({
        //             targets: clip,
        //             x: '+=' + this.s,
        //             repeat: 2,
        //             yoyo: true,
        //             ease: 'Sine.inOut',
        //             duration: 100
        //         });
        //     });

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
                            this.time.delayedCall(1000, ()=>{
                                this.spawnItem('Skeleton Key', 1000, 667, "I can probably use this key to open the door.", "I have \"skeleton key\" now.");
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

        // let key = this.add.text(1000, 667, "Skeleton Key")
        // .setFontSize(this.s * 2)
        // .setInteractive()
        // .on('pointerover', () => {
        //     this.showMessage("I can probably use this key to open the door.")
        // })
        // .on('pointerdown', () => {
        //     this.showMessage("I have \"skeleton key\" now.");
        //     this.gainItem('key');
        //     this.tweens.add({
        //         targets: key,
        //         y: `-=${2 * this.s}`,
        //         alpha: { from: 1, to: 0 },
        //         duration: 500,
        //         onComplete: () => key.destroy()
        //     });
        // })

        // this.time.delayedCall(1500, ()=>{
        //     settings = "tip1";
        //     this.scene.start('loading');
        //     // go_to_scene(this,'loading','tip1')
        // });
            
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

class JailCells extends AdventureScene {
    constructor() {
        super("JailCells", "The Cells");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("jailsBg", "jails.jpg");
    }
    create() {
        super.create("jailsBg", 2.1);
    }
    onEnter() {
        this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "awowowow", 
                            "MainArea");

        
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
    // scene: [MainArea],
    title: "Adventure Game",
});

