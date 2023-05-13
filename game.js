class HallwayToMainArea extends AdventureScene {
    constructor() {
        super("HallwayToMainArea", "Hallway");
    }
    preload() {
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        this.load.path = "./assets/";
        this.load.image("hallwayBg", "hallway.jpg");
    }
    create() {
        super.create("hallwayBg", 2.1);
    }
    onEnter() {
        this.gainItem('🗡️ Simple Dagger');
        this.showMessage("Where is the treasure? I must find it.");

        let skeleton = this.createEntity("💀 Skeleton", 1000, 667);
        skeleton.list[1].on('pointerover', () => {
                this.showMessage("Hmm... this skeleton might have a key to that door.");
                this.checkVisual(skeleton.list[1]);
            })
            .on('pointerdown', () => {
                if (this.holdingItem("🗡️ Simple Dagger")) {
                    this.showMessage("I have defeated the skeleton. It dropped a \"skeleton key\"!");
                    this.tweens.add({
                        targets: skeleton,
                        angle: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            skeleton.destroy();
                            this.time.delayedCall(50, ()=>{
                                this.spawnItem('🔑 Skeleton Key', 
                                                1000, 
                                                667, 
                                                "I can probably use this key to open the door.", 
                                                "I have \"skeleton key\" now.");
                            });
                        }
                    });
                }
                else {
                    this.showMessage("I'll need to select my \"🗡️ Simple Dagger\" first and then click on the skeleton.");
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
            
        let door = this.createEntity("🚪 Locked Door", 462, 497);
        door.list[1].on('pointerover', () => {
                this.checkVisual(door.list[1]);
                if (this.hasItem("🔑 Skeleton Key")) {
                    this.showMessage("I have the key for this door.");
                } else {
                    this.showMessage("It's locked. I need to find a key.");
                }
            })
            .on('pointerdown', () => {
                if (this.holdingItem("🔑 Skeleton Key")) {
                    this.loseItem("🔑 Skeleton Key");
                    this.showMessage("*squeak*");
                    door.list[0].setText("🚪 Unlocked Door");
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
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        this.load.path = "./assets/";
        this.load.image("darkRoomBg", "darkRoom.jpg");
    }
    create() {
        super.create("darkRoomBg", 2.1);
    }
    onEnter() {
        let leaveConfirmation = 0;

        let leave = this.createEntity("Leave", 660, 990, "#FFFFFF");
        leave.list[1].on('pointerover', () => {
            this.checkVisual(leave.list[1]);
            if (this.hasItem("⚱️⚜️👑 Loot")) {
                this.showMessage("Time to make a fortune selling this stuff!");
            }
            else if (this.hasInteracted("giftedPerson")) {
                this.showMessage("Oh well, at least someone else is going to be rich...");
            }
            else {
                this.showMessage("Abandon my mission and run away.");
            }
        })
        .on('pointerdown', () => {
            // console.log(leaveConfirmation);
            if (leaveConfirmation == 0) {
                this.showMessage("Are you sure you want to leave?");
            }
            else {
                this.gotoScene("summary");
            }
        })
        .on('pointerup', () => {
            leaveConfirmation = 1;
        });
        
        // this.createDoorway("Leave", 
        //                     660, 
        //                     990, 
        //                     this.hasItem("⚱️⚜️👑 Loot") ? 
        //                     "Time to make a fortune selling this stuff!" : 
        //                     this.hasInteracted("giftedPerson") ? "Oh well, at least someone else is going to be rich..." : "Abandon my mission and run away.",  
        //                     "summary",
        //                     "#FFFFFF");

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
                            1040, 
                            405, 
                            this.hasItem("🪄 Sol Beam") ? "That place has been ransacked." : "Maybe something useful is in here.", 
                            "Armory");
        
        this.createDoorway("Ominous Door", 
                            660,
                            413, 
                            this.hasInteracted("bossDefeated") ? "That ominous feeling is gone." : this.hasInteracted("bossSeen") ? "I need help or a stronger weapon against that being." : "I feel an eerie presence behind this door.", 
                            "BossRoom");

    }
}

class JailCells extends AdventureScene {
    constructor() {
        super("JailCells", "The Cells");
    }
    preload() {
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        this.load.path = "./assets/";
        this.load.image("jailsBg", "jails.jpg");
    }
    create() {
        super.create("jailsBg", 2.1, this.game.config.width / 2 - this.game.config.width * 0.05);
    }
    onEnter() {
        let hastalked = false;
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
            let leftCell = this.createEntity("⛓️ Unlocked Cell", 50, 440);
            leftCell.list[1].on('pointerover', () => {
                    this.checkVisual(leftCell.list[1]);
                })
                .on('pointerdown', () => {
                    this.showMessage("I can see a few plants sticking out of the walls.");
                });
        }
        else {
            let leftCell = this.createEntity("⛓️ Cell", 97, 467);
            leftCell.list[1].on('pointerover', () => {
                    this.checkVisual(leftCell.list[1]);
                    if (this.hasItem("🔑 Jail Key")) {
                        this.showMessage("I can open this cell.");
                    } else {
                        this.showMessage("I don't have a key for these jail cells.");
                    }
                })
                .on('pointerdown', () => {
                    if (this.holdingItem("🔑 Jail Key")) {
                        this.showMessage("*creak*");
                        leftCell.list[0].setText("⛓️ Unlocked Cell").setWordWrapWidth(1);
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
            let middleCell = this.createEntity("⛓️ Unlocked Cell", 575, 463);
            middleCell.list[1].on('pointerover', () => {
                    this.checkVisual(middleCell.list[1]);
                })
                .on('pointerdown', () => {
                    this.showMessage("You comprehend nothing, just emptiness, as you try to observe what was in this cell.");
                });
            
            if (!this.hasItem("🧍 Person's Aid") && !this.hasInteracted("destroyedPerson") && !this.hasInteracted("giftedPerson")) {
                let person = this.createEntity("🧍 Person", 433, 667);
                person.list[1].on('pointerover', () => {
                        this.checkVisual(person.list[1]);
                        if (!hastalked) {
                            this.showMessage("The person looks at you gratefully. Maybe he can help you.");   
                        }
                        else {
                            this.showMessage("You can try giving this guy some item. Or click him again to have him join you."); 
                        }
                    })
                    .on('pointerdown', () => {
                        if (!hastalked) {
                            this.showMessage("\"Hello, do you have any items for me? If not, click on me again and I will join you on your mission. ");
                            hastalked = true;
                        }
                        else if (this.holdingItem("🗡️ Simple Dagger")) {
                            this.showMessage("No thanks.");
                            this.tweens.add({
                                targets: person,
                                x: '+=' + this.s,
                                repeat: 2,
                                yoyo: true,
                                ease: 'Sine.inOut',
                                duration: 100
                            });
                        }
                        else if (this.holdingItem("🪄 Sol Beam")) {
                            this.showMessage("AAAAAAAAAAAAAAAAAAAaaaaaaaaaaaa a a  a    a     a        a....");
                            this.interacted.push("destroyedPerson");
                            this.tweens.add({
                                targets: person,
                                y: `-=${2 * this.s}`,
                                alpha: { from: 1, to: 0 },
                                duration: 500,
                                onComplete: () => person.destroy()
                            });
                        }
                        else if (this.holdingItem("⚱️⚜️👑 Loot")) {
                            this.showMessage("WOAH!! Now this is a nice gift! Thank you very much!!!! I shall take my leave now before you change your mind!");
                            this.interacted.push("giftedPerson");
                            this.loseItem("⚱️⚜️👑 Loot");
                            this.tweens.add({
                                targets: person,
                                y: `-=${2 * this.s}`,
                                alpha: { from: 1, to: 0 },
                                duration: 500,
                                onComplete: () => person.destroy()
                            });
                        }
                        else if (this.holdingItem("🥩 Bat Meat")) {
                            this.showMessage("Wow, protein!!!!! Omnomnomonononomononom");
                            this.interacted.push("gavePersonFood");
                            this.loseItem("🥩 Bat Meat");
                        }
                        else if (this.holdingItem("any")) {
                            this.showMessage("A gift? For me? Sorry, I don't need that.");
                            this.tweens.add({
                                targets: person,
                                x: '+=' + this.s,
                                repeat: 2,
                                yoyo: true,
                                ease: 'Sine.inOut',
                                duration: 100
                            });
                        }
                        else if (!this.hasItem("🧍 Person's Aid") && this.holdingItem(null) && hastalked) {
                            this.showMessage("\"Thanks for letting me out, I will follow you around now as a gesture of thanks!");
                            this.gainItem("🧍 Person's Aid");
                            this.interacted.push("acceptedPerson");
                            this.tweens.add({
                                targets: person,
                                y: `-=${2 * this.s}`,
                                alpha: { from: 1, to: 0 },
                                duration: 500,
                                onComplete: () => person.destroy()
                            });
                        }
                    });
            }
        }
        else {
            let middleCell = this.createEntity("⛓️ Cell", 635, 463);
            middleCell.list[1].on('pointerover', () => {
                    this.interacted.push("personSeen");
                    this.checkVisual(middleCell.list[1]);
                    if (this.hasItem("🔑 Jail Key")) {
                        this.showMessage("I can let this person out with my key!");
                    } else {
                        this.showMessage("why is person still in here, did they get left behind?");
                    }
                })
                .on('pointerdown', () => {
                    if (this.holdingItem("🔑 Jail Key")) {
                        this.showMessage("*creak*");
                        middleCell.list[0].setText("⛓️ Unlocked Cell").setWordWrapWidth(1);
                        this.interacted.push("middleCell");
                        this.interacted.push("helpedPerson");
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
            let rightCell = this.createEntity("⛓️ Unlocked Cell", 1152, 507);
            rightCell.list[1].on('pointerover', () => {
                    this.checkVisual(rightCell.list[1]);
                })
                .on('pointerdown', () => {
                    this.showMessage("There is nothing here.");
                });

            if (!this.hasInteracted("batKilled")) {
                let bat = this.createEntity("🦇 Bat", 861, 131);
                bat.list[1].on('pointerover', () => {
                        this.checkVisual(bat.list[1]);
                        this.showMessage('*flaps*');
                        this.tweens.add({
                            targets: bat,
                            x: this.s + (this.h - 2 * this.s) * Math.random(),
                            y: this.s + (this.h - 2 * this.s) * Math.random(),
                            ease: 'Sine.inOut',
                            duration: 500
                        });
                    })
                    .on('pointerdown', () => {
                        if (this.holdingItem("🗡️ Simple Dagger") || this.holdingItem("🪄 Sol Beam")) { 
                            this.interacted.push("batKilled");
                            this.tweens.add({
                                targets: bat,
                                angle: `-=${2 * this.s}`,
                                alpha: { from: 1, to: 0 },
                                duration: 500,
                                onComplete: () => {
                                    bat.destroy();
                                    this.time.delayedCall(50, ()=>{
                                        this.spawnItem('🥩 Bat Meat', 
                                                        765, 
                                                        671, 
                                                        "Food?", 
                                                        "What am I going to do with this.");
                                    });
                                }
                            });
                        } 
                        else {
                            this.showMessage("Maybe I can use a weapon on it.");
                        } 
                    });
            }
        }
        else {
            let rightCell = this.createEntity("⛓️ Cell", 1202, 507);
            rightCell.list[1].on('pointerover', () => {
                this.checkVisual(rightCell.list[1]);
                if (this.hasItem("🔑 Jail Key")) {
                    this.showMessage("I can open this cell.");
                } else {
                    this.showMessage("I don't have a key for these jail cells.");
                }
            })
            .on('pointerdown', () => {
                if (this.holdingItem("🔑 Jail Key")) {
                    this.showMessage("*creak*");
                    rightCell.list[0].setText("⛓️ Unlocked Cell").setWordWrapWidth(1);
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
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
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
        let zombie = this.createEntity("🧟 Zombie Guard", 211, 647);
        zombie.list[1].on('pointerover', () => {
                this.showMessage("Slow and wandering aimlessly.");
                this.checkVisual(zombie.list[1]);
            })
            .on('pointerdown', () => {
                if (this.holdingItem("🗡️ Simple Dagger") || this.holdingItem("🪄 Sol Beam")) {
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
                                this.spawnItem('🔑 Guard Room Key', 
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
            this.tweens.add({
                targets: zombie,
                x: this.s + (this.h - 5 * this.s) * Math.random(),
                y: this.s + (this.h - 2 * this.s) * Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.inOut',
                duration: 10000
            });
        }
        else if (this.hasInteracted("zombie") && !this.hasItem("🔑 Guard Room Key") && !this.hasInteracted("guardDoor")) {
            this.spawnItem('🔑 Guard Room Key', 
                            211, 
                            647, 
                            "I can probably use this key to open the guard room.", 
                            "I can open the guard room with this.");
        }

        if (this.hasInteracted("guardDoor")) {
            if (this.interacted[this.interacted.length - 1] == "guardDoor") {
                this.showMessage("I have opened the door to the guard room.");
            }
            let guardRoom = this.createEntity("Guard Room", 716, 594);
            guardRoom.list[1].on('pointerover', () => {
                    this.showMessage("Abandoned and stripped clean.");
                    this.checkVisual(guardRoom.list[1]);
                })
                    .on('pointerdown', () => {
                    this.gotoScene('GuardRoom', 0);
                });
        }
        else {
            let guardRoom = this.createEntity("🚪 Locked Door", 716, 594);
            guardRoom.list[1].on('pointerover', () => {
                this.checkVisual(guardRoom.list[1]);
                if (this.hasItem("🔑 Guard Room Key")) {
                    this.showMessage("I have a key for this door.");
                } else {
                    this.showMessage("I don't have a key for this.");
                }
            })
            .on('pointerdown', () => {
                if (this.holdingItem("🔑 Guard Room Key")) {
                    this.loseItem("🔑 Guard Room Key");
                    this.showMessage("*rumbles*");
                    guardRoom.list[0].setText("Guard Room").setWordWrapWidth(1);
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
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
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
        let arrow = this.createEntity("🏹 Broken Arrow", 200, 640);
        arrow.list[1].on('pointerover', () => {
                this.showMessage("Broken in half.")
                this.checkVisual(arrow.list[1]);
            })
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
        
        if (!this.hasItem("🪄 Sol Beam")) {
            let wand = this.spawnItem("🪄 Sol Beam", 
                            1160, 
                            415, 
                            "A wand with a note next to it. It says \"Sol Beam\"", 
                            "Cool, this is way stronger than my dagger.");
            wand.list[1].on('pointerdown', () => {
                this.interacted.push("gotSolBeam");
            });
        }

    }
}

class BossRoom extends AdventureScene {
    constructor() {
        super("BossRoom", "Throne Room");
    }
    preload() {
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
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

        if (!this.hasInteracted("bossDefeated")) {
            let boss = this.createEntity(" ↼⚟❪◯❫⚞⇀ Apuloxizelth", 670, 657, "#FF0000");
            this.tweens.add({
                targets: boss,
                y: 400,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.inOut',
                duration: 10000
            });
            boss.list[1].on('pointerover', () => {
                    this.showMessage("Wow, no way I can beat this entity with my simple dagger.");
                    this.checkVisual(boss.list[1]);
                    this.interacted.push("bossSeen");
                })
                .on('pointerdown', () => {
                    if (this.holdingItem("🧍 Person's Aid") || this.holdingItem("🪄 Sol Beam")) {
                        if (this.holdingItem ("🧍 Person's Aid")) {
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
                                    this.spawnItem('⚱️⚜️👑 Loot', 
                                                    670, 
                                                    657, 
                                                    "Money is in my sight!", 
                                                    "Oh boy time to be rich!");
                                });
                            }
                        });
                    }
                    else if (this.holdingItem("🗡️ Simple Dagger")) {
                        door.destroy();
                        this.inventory = [];
                        this.updateInventory();
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
        else {
            this.spawnItem('⚱️⚜️👑 Loot', 
                            670, 
                            657, 
                            "Money is in my sight!", 
                            "Oh boy time to be rich!");
        }
        
    }
}

class GuardRoom extends AdventureScene {
    constructor() {
        super("GuardRoom", "Guard Room");
    }
    preload() {
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
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

        if (!this.hasItem("🔑 Jail Key")) {
            this.spawnItem("🔑 Jail Key", 
                            164, 
                            714, 
                            "I might be able to use this key on some other places.", 
                            "*jingling noise*");
        }

        let rustedKey = this.createEntity("🔑 Rusted Key", 1117, 754);
        rustedKey.list[1].on('pointerover', () => {
                this.showMessage("Rusted beyond usage.")
                this.checkVisual(rustedKey.list[1]);
            })
            .on('pointerdown', () => {
                this.showMessage("In this state, nothing can be opened with this.");
                this.checkVisual(rustedKey.list[1]);
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
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        this.load.path = "./assets/";
        this.load.image("introBg", "startingArea.jpg");
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        this.add.image(this.w / 2, this.h / 2, "introBg").setScale(2.15);
        this.add.text(this.w / 2 - 700, this.h / 2 - 500, "Dungeon Looter", {color:"#FFFF00",}).setFontSize(150).preFX.addGlow("#000000");
        this.add.text(this.w / 2 - 800, this.h / 2 - 300, "Click anywhere to enter the dungeon.", {color:"#00FA93",}).setFontSize(75).preFX.addGlow("#000000");;
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
        if (this.hasInteracted("helpedPerson")) {
            playerEvents.push("After seeing a person stuck in the abandoned jail cell, you decided to help them out of there.");
        }
        if (!this.hasInteracted("helpedPerson") && this.hasInteracted("personSeen")) {
            playerEvents.push("You saw a person in a jail cell, but didn't help them out...");
        } 
        if (this.hasInteracted("destroyedPerson")) {
            playerEvents.push("You absolutely decimated the person from the abandoned jail with an accidental wave of your Sol Beam. Woopsies!");
        }
        if (this.hasInteracted("acceptedPerson")) {
            playerEvents.push("You graciously allowed the person to join you on your dungeon raid.");
        }
        if (this.hasInteracted("gavePersonFood") && this.hasInteracted("destroyedPerson")) {
            playerEvents.push("You gave the person some bat meat and then destroyed them. What is this thought process???");
        } 
        else if (this.hasInteracted("gavePersonFood")) {
            playerEvents.push("The person ate the suspicious bat meat you gave them. Hope it doesn't do anything...");
        }
        if (this.hasInteracted("killedByBoss") && this.hasInteracted("acceptedPerson")) {
            playerEvents.push("The person from the jail watches in confusion as you run at the unholy being with a simple dagger, and consequently get destroyed. Maybe they could've helped you???");
        } 
        if (this.hasInteracted("killedByBoss") && this.hasInteracted("gotSolBeam")) {
            playerEvents.push("You tried attacking the dungeon lord with a dagger when you had the option of using a spell thousands of times stronger than it.");
        } 
        if (this.hasInteracted("killedByBoss") && !(this.hasInteracted("gotSolBeam") || this.hasInteracted("acceptedPerson"))) {
            playerEvents.push("You were defeated by Apuloxizelth. Maybe you shouldn't attack a being of unfathomable power with a dagger.");
        }
        else if (this.hasInteracted("killedByBoss")) {
            playerEvents.push("Maybe you shouldn't use the starter weapon next time...");
        }
        if (this.hasInteracted("bossDefeated")) {
            if (this.hasInteracted("usedPersonAid")) {
                playerEvents.push("Using the help of the person from the jail, you both defeat Apuloxizelth with the power of friendship.");  
            } 
            else {
                playerEvents.push("Using your newly acquired Sol Beam, you plasmify Apuloxizelth into oblivion.");
            }
        }
        if (this.hasItem("⚱️⚜️👑 Loot")) {
            playerEvents.push("After you defeated Apuloxizelth, you succesfully got the loot. Time to be rich!");
        }
        else if (this.hasInteracted("bossDefeated") && !this.hasItem("⚱️⚜️👑 Loot") && !this.hasInteracted("giftedPerson")) {
            playerEvents.push("You defeated Apuloxizelth but didn't get the loot. Why?!?!");
        }
        else if (!this.hasInteracted("killedByBoss") && !this.hasInteracted("bossDefeated")) {
            playerEvents.push("You ran away from the dungeon. Sadly, no loot resulted from that.");
        }
        if (this.hasInteracted("giftedPerson") && this.hasInteracted("gavePersonFood")) {
            playerEvents.push("You gave the random person you saved everything of value from the dungeon. Is that good?");
        }
        else if (this.hasInteracted("giftedPerson")) {
            playerEvents.push("You graciously give the random person you saved from the jail all of your loot. Good?");
        }
        // playerEvents.push("text summaryy number 1 placeholder text blah blha aifhawkhakfjmawjyfjmafja.");
        // playerEvents.push("lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip");

        if (playerEvents.length < 3 && this.hasInteracted("bossDefeated")) {
            playerEvents.push("You really rushed through the dungeon... Nice Job!");
        }
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
        
        let summaryText = this.add.text(this.w / 2 - 400, this.h / 2 - 200, "Summary", {color:"#00FA93",}).setFontSize(200);
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
        
        playerEvents = []

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

