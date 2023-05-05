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

        let skeleton = this.add.text(1000, 667, "Skeleton")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
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

        let door = this.add.text(520, 512, "🚪 locked door", {color:"#00FFF0",})
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("Skeleton Key")) {
                    this.showMessage("I have the key for this door.");
                } else {
                    this.showMessage("It's locked. I need to find a key.");
                }
                // console.log(this.holdingItem("key"));
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Skeleton Key")) {
                    this.loseItem("Skeleton Key");
                    this.showMessage("*squeak*");
                    door.setText("Unlocked Door");
                    this.gotoScene('demo2');
                }
                else {
                    this.showMessage("Locked. I'll need to find a key.");
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
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
    scene: [Intro, HallwayToMainArea, Demo2, Outro],
    title: "Adventure Game",
});

