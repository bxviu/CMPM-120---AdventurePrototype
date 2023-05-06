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
        this.showMessage("Where is the treasure? I must find it.");

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
            
        let door = this.createEntity("🚪 Locked Door", 520, 512);
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
                    door.setText("🚪 Unlocked Door");
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
        this.createDoorway("Leave", 
                            512, 
                            990, 
                            this.hasItem("Loot") ? "Time to make a fortune selling this stuff!" : "Abandon my mission and run away.",  
                            "summary");

        this.createDoorway("Jail Cells", 
                            64, 
                            490, 
                            this.hasInteracted("middleCell") || this.hasInteracted("leftCell") || this.hasInteracted("rightCell") ? "Looks like even the cells were raided." : "I can hear a faint dripping noise coming from here.", 
                            "JailCells");

        this.createDoorway("Dark Hallway", 
                            348, 
                            350, 
                            this.hasInteracted("zombie")  ? "Silence... and darkness over there." : "I can hear a infrequent footsteps coming from there.", 
                            "StoneHallway");
        
        this.createDoorway("Armory", 
                            1020, 
                            405, 
                            this.hasItem("Sol Beam") ? "That place has been ransacked." : "Maybe something useful is in here.", 
                            "Armory");
        
        this.createDoorway("Ominous Door", 
                            660,
                            413, 
                            this.hasInteracted("bossSeen") ? "I need help or a stronger weapon against that being." : "I feel an eerie presence behind this door.", 
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
                            "", 
                            "MainArea");

        if (this.hasInteracted("leftCell")) {
            if (this.interacted[this.interacted.length - 1] == "leftCell") {
                this.showMessage("Nothing is in there.");
            }
            let leftCell = this.createEntity("Unlocked Cell", 50, 440);
            leftCell.on('pointerdown', () => {
                    this.showMessage("I can see a few plants sticking out of the walls.");
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
                        this.interacted.push("helpedPerson");
                    }
                    else {
                        this.showMessage("There is nothing here.");
                    }
                });
        }
        else {
            let middleCell = this.createEntity("Cell", 570, 463);
            middleCell.on('pointerover', () => {
                    this.interacted.push("personSeen");
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
                            "", 
                            "MainArea");

    if (!this.hasInteracted("zombie")) {
        let zombie = this.createEntity("Zombie Guard", 211, 647);
        zombie.on('pointerover', () => {
                this.showMessage("Slow and wandering aimlessly.");
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Simple Dagger") || this.holdingItem("Sol Beam")) {
                    this.showMessage("I have defeated the zombie guard. It dropped a key!");
                    this.interacted.push("zombie");
                    this.tweens.add({
                        targets: zombie,
                        angle: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            zombie.destroy();
                            this.time.delayedCall(50, ()=>{
                                this.spawnItem('Guard Room Key', 
                                                211, 
                                                647, 
                                                "I can probably use this key to open the guard room.", 
                                                "I can open the guard room with this.");
                            });
                        }
                    });
                }
                else {
                    this.showMessage("Ouch, I can't fight this thing bare handed...");
                    this.tweens.add({
                        targets: zombie,
                        x: '+=' + this.s,
                        repeat: 2,
                        yoyo: true,
                        ease: 'Sine.inOut',
                        duration: 100
                    });
                }
            })
        }

        if (this.hasInteracted("guardDoor")) {
            if (this.interacted[this.interacted.length - 1] == "guardDoor") {
                this.showMessage("I have opened the door to the guard room.");
            }
            let guardRoom = this.createEntity("Guard Room", 716, 594);
            guardRoom.on('pointerover', () => {
                    this.showMessage("Abandoned and stripped clean.");
                })
                    .on('pointerdown', () => {
                    this.gotoScene('GuardRoom', 0);
                });
        }
        else {
            let guardRoom = this.createEntity("Locked Door", 716, 594);
            guardRoom.on('pointerover', () => {
                if (this.hasItem("Guard Room Key")) {
                    this.showMessage("I have a key for this door.");
                } else {
                    this.showMessage("I don't have a key for this.");
                }
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Guard Room Key")) {
                    // this.loseItem("Guard Room Key");
                    this.showMessage("*rumbles*");
                    guardRoom.setText("Guard Room").setWordWrapWidth(1);
                    this.interacted.push("guardDoor");
                    this.gotoScene('GuardRoom');
                }
                else {
                    this.showMessage("Locked. I'll need a key.");
                }
            });
        }
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
                            "", 
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
                            "A wand with a note next to it. It says \"Sol Beam\"", 
                            "Cool, this is way stronger than my dagger.");
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
        let door = this.createDoorway("Back to Dark Room", 
                            512, 
                            990, 
                            "", 
                            "MainArea");

        let boss = this.createEntity("Apuloxizelth", 670, 657);
        boss.on('pointerover', () => {
                this.showMessage("Wow, no way I can beat this entity with my simple dagger.");
                this.interacted.push("bossSeen");
            })
            .on('pointerdown', () => {
                if (this.holdingItem("Person's Aid") || this.holdingItem("Sol Beam")) {
                    if (this.holdingItem ("Person's Aid")) {
                        this.interacted.push("usedPersonAid");
                    } 
                    else {
                        this.interacted.push("usedSolBeam");
                    } 
                    this.showMessage("Apuloxizelth has been defeated!!! Where's my loot?!");
                    this.interacted.push("bossDefeated");
                    this.tweens.add({
                        targets: boss,
                        angle: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            boss.destroy();
                            this.time.delayedCall(50, ()=>{
                                this.spawnItem('Loot', 
                                                670, 
                                                657, 
                                                "Money is in my sight!", 
                                                "Oh boy time to be rich!");
                            });
                        }
                    });
                }
                else if (this.holdingItem("Simple Dagger")) {
                    door.destroy();
                    this.showMessage("Apuloxizelth easily disarms you and stabs you in the back with your own dagger...");
                    this.interacted.push("killedByBoss");
                    this.time.delayedCall(4000, ()=>{
                        this.gotoScene('summary');
                    });
                }
                else {
                    this.showMessage("I am not going to fight that eldritch horror with my bare hands.");
                    this.tweens.add({
                        targets: boss,
                        x: '+=' + this.s,
                        repeat: 2,
                        yoyo: true,
                        ease: 'Sine.inOut',
                        duration: 100
                    });
                }
            })
        
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
        this.createDoorway("Back to Dark Hallway", 
                            512, 
                            990, 
                            "", 
                            "StoneHallway");

        if (!this.hasItem("Jail Key")) {
            this.spawnItem("Jail Key", 
                            164, 
                            714, 
                            "I might be able to use this key on some other places.", 
                            "*jingling noise*");
        }

        let rustedKey = this.add.text(1117, 754, "Rusted Key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Rusted beyond usage."))
            .on('pointerdown', () => {
                this.showMessage("In this state, nothing can be opened with this.");
                this.tweens.add({
                    targets: rustedKey,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });
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
        this.add.text(this.w / 2 - 700, this.h / 2 - 500, "Dungeon Looter").setFontSize(150);
        this.add.text(this.w / 2 - 800, this.h / 2 - 300, "Click anywhere to enter the dungeon.").setFontSize(75);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('HallwayToMainArea'));
        });
        
    }
}

let playerEvents = []
class Summary extends AdventureScene {
    constructor() {
        super('summary');
    }
    create() {
        let summaryText = this.add.text(this.w / 2, this.h / 2, "Summary").setFontSize(100);
        this.time.delayedCall(1000, () => summaryText.destroy());
        // let events = []
        if (this.hasInteracted("helpedPerson")) {
            playerEvents.push("You helped free the person from the abandoned jail.");
        }
        if (!this.hasInteracted("helpedPerson") && this.hasInteracted("personSeen")) {
            playerEvents.push("You saw a person in a jail cell, but didn't help them out...");
        } 
        if (this.hasInteracted("killedByBoss")) {
            playerEvents.push("You were defeated by Apuloxizelth.");
        }
        if (this.hasInteracted("bossDefeated")) {
            if (this.hasInteracted("usedPersonAid")) {
                playerEvents.push("Using the help of the person from the jail, you both defeat Apuloxizelth with the power of friendship.");  
            } 
            else {
                playerEvents.push("Using your newly acquired Sol Beam, you plasmify Apuloxizelth into oblivion.");
            }
        }
        if (this.hasItem("Loot")) {
            playerEvents.push("After you defeated Apuloxizelth, you succesfully got the loot. Time to be rich!");
        }
        else if (this.hasInteracted("bossDefeated") && !this.hasItem("Loot")) {
            playerEvents.push("You defeated Apuloxizelth but didn't get the loot. Why?!?!");
        }
        else if (!this.hasInteracted("killedByBoss") && !this.hasInteracted("bossDefeated")) {
            playerEvents.push("You ran away from the dungeon. Sadly, no loot resulted from that.");
        }
        // playerEvents.push("You helped frerthe abandoned jail.");
        // playerEvents.push("You helped free thehe abandoned jail.");

        // if (playerEvents.length == 0) {
        //     playerEvents.push("You left immediately after going through the first door. At least you avoided any possible danger...");
        // }
        this.gotoScene('outro', 0);
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        
        let summaryText = this.add.text(this.w / 2 - 400, this.h / 2 - 200, "Summary").setFontSize(200);
        this.tweens.add({
            targets: summaryText,
            alpha: {from:0, to:1},
            duration: 1000,
        });
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: summaryText,
                y: `-=0.07`,
                x: `+=100`,
                duration: 3000,
                ease:"Cubic.easeOut"
            });
            this.tweens.addCounter({
                from: 200,
                to: 100,
                onUpdate: function (tween) {
                    summaryText.setFontSize(tween.getValue());
                }
            });
        });

        let eventsText = this.add.text(this.w / 2 - 300, this.h / 2 - 100, "").setFontSize(50).setWordWrapWidth(700);
        let eventList = [];
        for (let i = 0; i < playerEvents.length; i++) {
            let text = this.add.text(this.w / 2 - 300, this.h + 1000, playerEvents[i])
                        .setFontSize(50).setWordWrapWidth(700);
            eventList.push(text);
        }

        for (let i = 0; i < eventList.length; i++) {
            this.tweens.add({
                targets: eventList[i],
                alpha: {from:0, to:1},
                y: this.h / 2 - 100, 
                delay: ((i+1)*4000 + 1000) - 500*i,
                duration: 500,
                ease:"Cubic.easeOut",
                onComplete: () => {
                    this.tweens.add({
                        targets: eventList[i],
                        alpha: {from:1, to:0},
                        x: "+=1000", 
                        delay: 3000,
                        duration: 500,
                        ease:"Cubic.easeOut"
                        });
                }
            });
        }

        let endText = this.add.text(this.w / 2 - 300, this.h + 1000, "That's all!\nClick anywhere to restart.")
        .setFontSize(50).setWordWrapWidth(700);
        this.tweens.add({
            targets: endText,
            alpha: {from:0, to:1},
            y: this.h / 2 - 100, 
            delay: ((playerEvents.length+1)*4000 + 1000) - 500*playerEvents.length,
            duration: 500,
            ease:"Cubic.easeOut",
        });
        
        this.time.delayedCall((playerEvents.length+1)*4000 + 1000, () => {
            this.input.on('pointerdown', () => this.scene.start('intro'));
        });
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    // scene: [MainArea, JailCells, StoneHallway, Armory, BossRoom, GuardRoom, Summary, Outro],
    scene: [Intro, HallwayToMainArea, MainArea, JailCells, StoneHallway, Armory, BossRoom, GuardRoom, Summary, Outro],
    title: "Adventure Game",
});

