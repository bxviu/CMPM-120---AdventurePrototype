A simple adventure game by Benthan Vu based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**: (name at least 4 of the classes)
    - HallwayToMainArea
    - MainArea
    - JailCells 
    - StoneHallway
    - Armory
    - BossRoom
    - GuardRoom
- **2+ scenes *not* based on `AdventureScene`**: (name the classes)
    - Intro
    - Outro
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: itemGrabbed (helps to allow the player to select an item and have it follow the mouse cursor)
    - Enhancement 2: holdingItem (helps to allow the scene to check if the player is holding an item when they interact with something)
    - Enhancement 3: createEntity (creates an object that will have custom pointerover and pointerdown effects added to it later)
    - Enhancement 4: createDoorway (creates an interactable text with preset pointer effects that allows players to traverse scenes)
    - Enhancement 5: spawnItem (spawns a item with preset pointer effects for the user to add to their inventory)
    - Enhancement 6: returnItem (makes a tween for the item being held to move back towards the inventory box)
    - Enhancement 7: hasInteracted (singular line that checks for any notable events that happened in the playthrough)

Experience requirements:
- **4+ locations in the game world**: (name at least 4 of the classes)
    - Hallway
    - Dark Room
    - Jail 
    - Dark Hallway
    - Armory
    - Throne Room
    - Guard Room
- **2+ interactive objects in most scenes**: (describe two examples)
    - In the Jail Cells, there are 4 interactable objects, the 3 cells, and the exit. Additionally, opening the cells creates 2 more objects, a person, and a bat.
    - In the Armory, there are 3 interactable objects, the exit, a broken arrow, and a sol beam spell.
- **Many objects have `pointerover` messages**: (describe two examples)
    - In the dark hallway, if you hover over the zombie and locked guard door with your mouse, a message shows up relating to the objects.
    - In the dark room, hovering over the Ominous Door has different messages depending on some events that happened in the playthrough.
- **Many objects have `pointerdown` effects**: (describe two examples)
    - In the Jail Cells, if you let the person out of the jail, you can try giving them items by clicking on the item in the inventory first, and then clicking on the person. They will have special responses to some of them.
    - In the Throne Room, depending on what item your mouse is holding, the boss responds in different ways. Additionally, if you defeat the boss, it will drop loot that you can additionally click on to pick up.
- **Some objects are themselves animated**: (describe two examples)
    - In the dark hallway, the zombie moves around aimlessly.
    - You can click items in your inventory to hold them, and once you click again, the item will be used on whatever you clicked on and tweened back to the inventory. 

Asset sources:
- Every image was created using ai from https://runwayml.com/. The only changes I made was resizing it and placing it in the background.
- Prompts:
    - Start Screen: dungeon area with an open doorway
    - Hallway: dungeon area with an open doorway
    - Dark Room: realistic dark dungeon lit by torches, with 4 doorways
    - Armory: realistic dark dungeon armory, scavenged and empty 
    - Jail Cells: realistic dimly lit dungeon prison with empty jail cells, one cell has a garden, first person view
    - Dark Hallway: realistic dungeon prison with jail cells, first person view
    - Guard Room: realistic dark dungeon armory, scavenged and empty 
    - Throne Room: realistic dungeon throne room, richly decorated

Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.
