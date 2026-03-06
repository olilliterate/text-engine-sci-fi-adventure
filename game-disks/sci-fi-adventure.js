// This simple game disk can be used as a starting point to create a new adventure.
// Change anything you want, add new rooms, etc.
const sciFiAdventure = () => ({
  roomId: 'spaceport-terminal', // Set this to the ID of the room you want the player to start in.
  rooms: [
    {
      id: 'spaceport-terminal', // Unique identifier for this room. Entering a room will set the disk's roomId to this.
      name: 'Zorpburg Intergalactic Spaceport Terminal Zeta', // Displayed each time the player enters the room.
      desc: `Years after your brother was abducted by aliens, you have believe you have finally located where he is being held: The Iridescent Capital of the Galactic Federation, Zorpburg
      
      You are currently in Terminal Zeta of Zorpburg Intergalactic Spaceport 
      
      There is a Skish working at a DESK in the centre of the room

      The matte white oblong spaceship you caught here lies to the NORTH

      To the EAST there appears to be a vending machine???

      To the SOUTH lies an AIRLOCK
      
      `, // Displayed when the player first enters the room.

      onLook: () => {
        const room = getRoom('spaceport-terminal');
        room.desc = `You are currently in Terminal Zeta of Zorpburg Intergalactic Spaceport 
      
        There is a Skish working at a DESK in the centre of the room

        The matte white oblong spaceship you caught here lies to the NORTH

        To the EAST there appears to be a machine???

        To the SOUTH lies an AIRLOCK
      
        `;
      },
      items: [
        {
          name: 'airlock',
          desc: 'It leads SOUTH. Presumably to the rest of the spaceport', // Displayed when the player looks at the item.
          onUse: () => println(`Type GO NORTH to try the airlock.`), // Called when the player uses the item.
        },
        {
          name: ['vending machine', 'machine'], // The player can refer to this item by either name. The game will use the first name.
          desc: `A contraption of some kind with a glass pane in the centre displaying various small capsules`,
        },
        {
          name: 'desk',
          desc: `A white spotless spherical desk`,
        },
        {
          name: ["spaceship", "rocket"],
          desc: `A bizarre spaceship that seeming floats on its own`
        }
      ],
      exits: [
        {
          dir: 'south', // "dir" can be anything. 
          id: 'Bandit',
          block: `The AIRLOCK is closed.`, // If an exit has a block, the player will not be able to go that direction until the block is removed.
        },
      ],
    },
    {
      id: 'spaceport-customs',
      name: 'Spaceport customs',
      desc: `It's scary`,
      exits: [
        {
          dir: 'north',
          id: 'spaceport-terminal',
        },
      ],
    },
    {
      id: 'Bandit', // unique ID for this room
      name: 'The Market', //
      // room description (shown when player first enters the room)
      desc:  `You step into the bustling market, a vibrant tapestry of colors and sounds. Stalls line the cobblestone streets, each one brimming with exotic goods and tantalizing aromas.

      The air is thick with the scent of spices and freshly baked bread, mingling with the lively chatter of merchants and customers haggling over prices.

      You're a stranger to this planet. BANDITS notice this and attack!!! Defeat them, get information and proceed`,

      // optional callback when player issues the LOOK command
      // here, we use it to change the foyer's description
      onLook: () => {
        const room = getRoom('Market');
        room.desc = `You are currently in the market. You are surrounded by bandits they look tough, but you're tougher.

        **Hint**: There's a laser sword stall to the north. Maybe you can find something useful there, to help you fight.

        Type **ITEMS** to see a list of items in the market . Or type **HELP** to see what else you can do!`;
      },
      // optional list of items in the room
      items: [
        {
          name: ['stall', `laser sword`, `laser sword stall`,'sword'], // the item's name
          desc: `This stall stocks laser swords. It is currently unattended`, // description shown when player looks at the item

          onUse: () => {
            disk.inventory.push({
              name: ['laser sword', 'sword'], // player can refer to this item by any of these names
              desc: `A sharp blade made of pure energy. It hums with power, ready to strike down any foe.`, // description shown when player looks at the item
              onUse() {
                  const room = getRoom(disk.roomId);
                  if (room.id === 'Bandit') {
                      const exit = getExit( 'north', room.exits);
                      if (exit.block) {
                          println(`You use the LASER SWORD to defeat the bandits! The path to the north is now clear.`);
                          delete exit.block;
                      }
                  }
              },
            })
          }
        },
        {
          name: "bandits", 
          desc: "They look tough but you're tougher"
        }
    
      ],
      exits:[
        {
          dir: 'north',
          id: 'pc-hq',
          block: `bandits are blocking your way`
        },
        
      ],
    },
  ],
  
  characters: [
    {
      name: ['Skish', "worker", 'receptionist'],
      roomId: 'spaceport-terminal',
      desc: "Though its hard to tell through their scaly face, they look overworked and tired", // printed when the player looks at the character
      img: `
      .------\\ /------.
      |       -       |
      |               |
      |               |
      |               |
   _______________________
   ===========.===========
     / ~~~~~     ~~~~~ \\
    /|     |     |\\
    W   ---  / \\  ---   W
    \\.      |o o|      ./
     |                 |
     \\    #########    /
      \\  ## ----- ##  /
       \\##         ##/
        \\_____v_____/
  
      `,
      // optional callback, run when the player talks to this character
      onTalk: () => println(`The creature lets out a terrible sound, which you suppose is meant to be a sigh "Do you need anything?" it grumbles.`),
      // things the player can discuss with the character
      topics: [
        {
          option: 'Can you open the **AIRLOCK**?',
          removeOnRead: true,
          // optional callback, run when the player selects this option
          onSelected() {
            println(`"Sure" it says at it forcefully slams it's leg against a button under the desk. The airlock to the **SOUTH** hisses then pops opening the way forward`);
            
            const room = getRoom('spaceport-terminal');
            const exit = getExit('south', room.exits);

            if (exit.block) {
              delete exit.block;
            }
          },
        },
        {
          option: 'What is that **MACHINE** for?',

          line: `"Bwahh Hah Bwahh Ha" it roars then says to you deadly serious "It's a vending machine"`,
          removeOnRead: true,
        },
        {
          option: `How do I use the **VENDING MACHINE**`,
          // text printed when the player selects this option by typing the keyword (EXITS)
          onSelected() {
            println(`"Look kid take this and just leave me alone" mutters the creature. It hands you a purple square object that feels like plastic`);

            disk.inventory.push({
              name: ["purple object" , "coin", "plastic object", "square object"],
              desc: `A purple square object that resembles a coin. It feels like plastic`,
              onUse: () => {
                  const room = getRoom(disk.roomId);
                  if (room.id === 'spaceport-terminal') {
                    // remove the block
                    println(`You insert the object into the machine, then you hear a clunk from the bottom as a capsule falls out. You take the CAPSULE???`)
                    disk.inventory.push({
                      name: "capsule???",
                      desc: `A strange and brightly colored capsule`
                    })
                    // this item can only be used once
                    const coin = getItem('purple object');
                  } else {
                    println(`There's to use this item with here.`);
                  }
                }
              }
            )
          },
          // instruct the engine to remove this option once the player has selected it
          removeOnRead: true,
          prereqs: ["machine"]
        },
      ],
    }]
});
