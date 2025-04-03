import type {APICategory} from "./types"

// This is a simplified version of the API categorization
// In a real app, this would parse the actual API documentation
export function categorizeAPI(): APICategory[] {
    return [
        {
            name: "Player",
            functions: [
                {
                    name: "GetLocalPlayerName",
                    description: "Get the name of the local player",
                    parameters: [],
                    returnType: "string",
                    returnDescription: "The name of the local player",
                },
                {
                    name: "PlayerCoord",
                    description: "Get the coordinates of the player",
                    parameters: [],
                    returnType: "WPOINT",
                    returnDescription: "The coordinates of the player",
                },
                {
                    name: "PlayerCoordfloat",
                    description: "Get the coordinates of the player as float values",
                    parameters: [],
                    returnType: "FFPOINT",
                    returnDescription: "The coordinates of the player as float values",
                },
                {
                    name: "GetHP_",
                    description: "Get the current health points of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The current health points",
                },
                {
                    name: "GetHPMax_",
                    description: "Get the maximum health points of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The maximum health points",
                },
                {
                    name: "GetPray_",
                    description: "Get the current prayer points of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The current prayer points",
                },
                {
                    name: "GetPrayMax_",
                    description: "Get the maximum prayer points of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The maximum prayer points",
                },
                {
                    name: "GetAddreline_",
                    description: "Get the current adrenaline level of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The current adrenaline level",
                },
                {
                    name: "GetHPrecent",
                    description: "Get the current health percentage of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The current health percentage (0-100)",
                },
                {
                    name: "Get_tick",
                    description: "Get the current game tick",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The current game tick",
                },
                {
                    name: "ReadPlayerAnim",
                    description: "Get the current animation ID of the player",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The current animation ID",
                },
                {
                    name: "Dist_FLP",
                    description: "Calculate distance from local player to a point",
                    parameters: [
                        {
                            name: "point",
                            type: "FFPOINT",
                            description: "The target point",
                            defaultValue: "",
                        },
                    ],
                    returnType: "number",
                    returnDescription: "The distance in game units",
                },
            ],
        },
        {
            name: "Inventory",
            functions: [
                {
                    name: "InvItemcount_",
                    description: "Get the count of a specific item in the inventory",
                    parameters: [
                        {
                            name: "item",
                            type: "number",
                            description: "The ID of the item to count",
                            defaultValue: "",
                        },
                    ],
                    returnType: "number",
                    returnDescription: "The count of the specified item",
                },
                {
                    name: "InvStackSize",
                    description: "Get the stack size of a specific item in the inventory",
                    parameters: [
                        {
                            name: "item",
                            type: "number",
                            description: "The ID of the item",
                            defaultValue: "",
                        },
                    ],
                    returnType: "number",
                    returnDescription: "The stack size of the specified item",
                },
                {
                    name: "InvFull_",
                    description: "Check if the inventory is full",
                    parameters: [],
                    returnType: "boolean",
                    returnDescription: "True if the inventory is full, false otherwise",
                },
                {
                    name: "Invfreecount_",
                    description: "Get the number of free slots in the inventory",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "The number of free slots",
                },
                {
                    name: "ClickInv_",
                    description: "Click on an item in the inventory",
                    parameters: [
                        {
                            name: "item",
                            type: "number",
                            description: "The ID of the item to click",
                            defaultValue: "",
                        },
                        {
                            name: "randomelement",
                            type: "number",
                            description: "Random element (0 default)",
                            defaultValue: "0",
                        },
                        {
                            name: "action",
                            type: "number",
                            description: "Action (0 left click)",
                            defaultValue: "0",
                        },
                        {
                            name: "xrand",
                            type: "number",
                            description: "Random X offset",
                            defaultValue: "0",
                        },
                        {
                            name: "yrand",
                            type: "number",
                            description: "Random Y offset",
                            defaultValue: "0",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "Container_Get_all",
                    description: "Get all items in a container",
                    parameters: [
                        {
                            name: "containerId",
                            type: "number",
                            description: "The ID of the container (93 for inventory)",
                            defaultValue: "93",
                        },
                    ],
                    returnType: "table",
                    returnDescription: "Table of items in the container",
                },
                {
                    name: "Container_Findfrom",
                    description: "Find an item in a container",
                    parameters: [
                        {
                            name: "container",
                            type: "table",
                            description: "The container to search in",
                            defaultValue: "{}",
                        },
                        {
                            name: "itemId",
                            type: "number",
                            description: "The ID of the item to find",
                            defaultValue: "",
                        },
                    ],
                    returnType: "table",
                    returnDescription: "The found item or nil",
                },
            ],
        },
        {
            name: "Actions",
            functions: [
                {
                    name: "DoAction_NPC",
                    description: "Perform an action on an NPC",
                    parameters: [
                        {
                            name: "action",
                            type: "number",
                            description: "The action to perform",
                            defaultValue: "",
                        },
                        {
                            name: "offset",
                            type: "number",
                            description: "The offset for the action",
                            defaultValue: "",
                        },
                        {
                            name: "objects",
                            type: "table|number",
                            description: "The NPC IDs to target",
                            defaultValue: "{}",
                        },
                        {
                            name: "maxdistance",
                            type: "number",
                            description: "Maximum distance to search",
                            defaultValue: "60",
                        },
                        {
                            name: "ignore_star",
                            type: "boolean",
                            description: "Whether to ignore starred NPCs",
                            defaultValue: "false",
                        },
                        {
                            name: "health",
                            type: "number",
                            description: "Minimum health of the NPC",
                            defaultValue: "0",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_Object",
                    description: "Perform an action on an object",
                    parameters: [
                        {
                            name: "action",
                            type: "number",
                            description: "The action to perform",
                            defaultValue: "",
                        },
                        {
                            name: "offset",
                            type: "number",
                            description: "The offset for the action",
                            defaultValue: "",
                        },
                        {
                            name: "obj",
                            type: "table|number",
                            description: "The object IDs to target",
                            defaultValue: "{}",
                        },
                        {
                            name: "maxdistance",
                            type: "number",
                            description: "Maximum distance to search",
                            defaultValue: "60",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_Tile",
                    description: "Perform an action on a tile",
                    parameters: [
                        {
                            name: "normal_tile",
                            type: "WPOINT",
                            description: "The tile coordinates",
                            defaultValue: "",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_WalkerF",
                    description: "Walk to a specific tile using float coordinates",
                    parameters: [
                        {
                            name: "normal_tile",
                            type: "FFPOINT",
                            description: "The tile coordinates as float values",
                            defaultValue: "",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_WalkerW",
                    description: "Walk to a specific tile using integer coordinates",
                    parameters: [
                        {
                            name: "normal_tile",
                            type: "WPOINT",
                            description: "The tile coordinates as integer values",
                            defaultValue: "",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_TileF",
                    description: "Click on a tile with float coordinates",
                    parameters: [
                        {
                            name: "tile",
                            type: "FFPOINT",
                            description: "The tile coordinates",
                            defaultValue: "",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_NPC__Direct",
                    description: "Directly interact with an NPC object",
                    parameters: [
                        {
                            name: "action",
                            type: "number",
                            description: "The action to perform",
                            defaultValue: "",
                        },
                        {
                            name: "offset",
                            type: "number",
                            description: "The offset for the action",
                            defaultValue: "",
                        },
                        {
                            name: "npc",
                            type: "table",
                            description: "The NPC object to interact with",
                            defaultValue: "{}",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_Object_Direct",
                    description: "Directly interact with a game object",
                    parameters: [
                        {
                            name: "action",
                            type: "number",
                            description: "The action to perform",
                            defaultValue: "",
                        },
                        {
                            name: "offset",
                            type: "number",
                            description: "The offset for the action",
                            defaultValue: "",
                        },
                        {
                            name: "object",
                            type: "table",
                            description: "The object to interact with",
                            defaultValue: "{}",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "DoAction_Interface",
                    description: "Interact with an interface element",
                    parameters: [
                        {
                            name: "action",
                            type: "number",
                            description: "The action to perform",
                            defaultValue: "",
                        },
                        {
                            name: "param1",
                            type: "number",
                            description: "Parameter 1",
                            defaultValue: "0",
                        },
                        {
                            name: "param2",
                            type: "number",
                            description: "Parameter 2",
                            defaultValue: "0",
                        },
                        {
                            name: "interfaceId",
                            type: "number",
                            description: "The interface ID",
                            defaultValue: "",
                        },
                        {
                            name: "componentId",
                            type: "number",
                            description: "The component ID",
                            defaultValue: "",
                        },
                        {
                            name: "subComponentId",
                            type: "number",
                            description: "The sub-component ID",
                            defaultValue: "-1",
                        },
                        {
                            name: "offset",
                            type: "number",
                            description: "The offset for the action",
                            defaultValue: "",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
            ],
        },
        {
            name: "Bank",
            functions: [
                {
                    name: "BankOpen2",
                    description: "Open the bank",
                    parameters: [],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "BankClose",
                    description: "Close the bank",
                    parameters: [],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "BankAllItems",
                    description: "Deposit all items in the inventory to the bank",
                    parameters: [],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "BankClickItem",
                    description: "Click on an item in the bank",
                    parameters: [
                        {
                            name: "id",
                            type: "number",
                            description: "The ID of the item to click",
                            defaultValue: "",
                        },
                        {
                            name: "mouse",
                            type: "number",
                            description: "Mouse button (0 for left, 1 for right)",
                            defaultValue: "0",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "BankGetItemStack",
                    description: "Get the stack size of an item in the bank",
                    parameters: [
                        {
                            name: "item",
                            type: "number",
                            description: "The ID of the item",
                            defaultValue: "",
                        },
                    ],
                    returnType: "number",
                    returnDescription: "The stack size of the item",
                },
            ],
        },
        {
            name: "Combat",
            functions: [
                {
                    name: "DoAction_Ability",
                    description: "Use an ability",
                    parameters: [
                        {
                            name: "abilityName",
                            type: "string",
                            description: "The name of the ability",
                            defaultValue: "",
                        },
                        {
                            name: "param",
                            type: "number",
                            description: "Additional parameter",
                            defaultValue: "1",
                        },
                        {
                            name: "offset",
                            type: "number",
                            description: "The offset for the action",
                            defaultValue: "",
                        },
                        {
                            name: "useActionBar",
                            type: "boolean",
                            description: "Whether to use the action bar",
                            defaultValue: "false",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "GetABs_name",
                    description: "Get information about an ability by name",
                    parameters: [
                        {
                            name: "abilityName",
                            type: "string",
                            description: "The name of the ability",
                            defaultValue: "",
                        },
                    ],
                    returnType: "table",
                    returnDescription: "Information about the ability",
                },
                {
                    name: "DoAction_BDive_Tile",
                    description: "Use Bladed Dive ability to a specific tile",
                    parameters: [
                        {
                            name: "tile",
                            type: "WPOINT",
                            description: "The target tile",
                            defaultValue: "",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "CheckAnim",
                    description: "Check if player is performing a specific animation",
                    parameters: [
                        {
                            name: "maxTime",
                            type: "number",
                            description: "Maximum time to check",
                            defaultValue: "20",
                        },
                        {
                            name: "sleepTime",
                            type: "number",
                            description: "Sleep time between checks",
                            defaultValue: "4",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if animation is active, false otherwise",
                },
            ],
        },
        {
            name: "Utility",
            functions: [
                {
                    name: "Sleep_tick",
                    description: "Sleep for a specified number of game ticks",
                    parameters: [
                        {
                            name: "count",
                            type: "number",
                            description: "Number of ticks to sleep",
                            defaultValue: "1",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if successful, false otherwise",
                },
                {
                    name: "RandomSleep",
                    description: "Sleep for a random amount of time",
                    parameters: [],
                    returnType: "void",
                    returnDescription: "No return value",
                },
                {
                    name: "RandomSleep2",
                    description: "Sleep for a customizable random amount of time",
                    parameters: [
                        {
                            name: "wait",
                            type: "number",
                            description: "Base sleep time (100%)",
                            defaultValue: "600",
                        },
                        {
                            name: "sleep",
                            type: "number",
                            description: "Random sleep addition",
                            defaultValue: "300",
                        },
                        {
                            name: "sleep2",
                            type: "number",
                            description: "Rare random sleep addition",
                            defaultValue: "100",
                        },
                    ],
                    returnType: "void",
                    returnDescription: "No return value",
                },
                {
                    name: "Math_RandomNumber",
                    description: "Generate a random number up to the specified maximum",
                    parameters: [
                        {
                            name: "numbersize",
                            type: "number",
                            description: "Maximum value (exclusive)",
                            defaultValue: "100",
                        },
                    ],
                    returnType: "number",
                    returnDescription: "A random number between 0 and numbersize-1",
                },
                {
                    name: "ReadAllObjectsArray",
                    description: "Read all objects in the game world",
                    parameters: [
                        {
                            name: "types",
                            type: "table",
                            description: "Types of objects to read",
                            defaultValue: "{-1}",
                        },
                        {
                            name: "ids",
                            type: "table",
                            description: "IDs of objects to read",
                            defaultValue: "{-1}",
                        },
                        {
                            name: "names",
                            type: "table",
                            description: "Names of objects to read",
                            defaultValue: "{}",
                        },
                    ],
                    returnType: "table",
                    returnDescription: "Table of all matching objects",
                },
                {
                    name: "WaitUntilMovingEnds",
                    description: "Wait until the player stops moving",
                    parameters: [
                        {
                            name: "maxTime",
                            type: "number",
                            description: "Maximum time to wait",
                            defaultValue: "20",
                        },
                        {
                            name: "sleepTime",
                            type: "number",
                            description: "Sleep time between checks",
                            defaultValue: "4",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if player stopped moving, false if timed out",
                },
                {
                    name: "Math_DistanceF",
                    description: "Calculate distance between two points",
                    parameters: [
                        {
                            name: "point1",
                            type: "FFPOINT",
                            description: "First point",
                            defaultValue: "",
                        },
                        {
                            name: "point2",
                            type: "FFPOINT",
                            description: "Second point",
                            defaultValue: "",
                        },
                    ],
                    returnType: "number",
                    returnDescription: "The distance between the points",
                },
                {
                    name: "Math_FreeTiles",
                    description: "Find free tiles around a point",
                    parameters: [
                        {
                            name: "points",
                            type: "table",
                            description: "Points to avoid",
                            defaultValue: "{}",
                        },
                        {
                            name: "radius",
                            type: "number",
                            description: "Radius to search",
                            defaultValue: "3",
                        },
                        {
                            name: "maxDistance",
                            type: "number",
                            description: "Maximum distance to search",
                            defaultValue: "10",
                        },
                        {
                            name: "additionalPoints",
                            type: "table",
                            description: "Additional points to avoid",
                            defaultValue: "{}",
                        },
                    ],
                    returnType: "table",
                    returnDescription: "Table of free tiles",
                },
                {
                    name: "KeyboardPress31",
                    description: "Simulate a keyboard press",
                    parameters: [
                        {
                            name: "key",
                            type: "number",
                            description: "Key code to press",
                            defaultValue: "",
                        },
                        {
                            name: "holdTime",
                            type: "number",
                            description: "Time to hold the key (ms)",
                            defaultValue: "100",
                        },
                        {
                            name: "delay",
                            type: "number",
                            description: "Delay after press (ms)",
                            defaultValue: "500",
                        },
                    ],
                    returnType: "void",
                    returnDescription: "No return value",
                },
                {
                    name: "DoRandomEvents",
                    description: "Handle random game events",
                    parameters: [],
                    returnType: "boolean",
                    returnDescription: "True if an event was handled",
                },
                {
                    name: "SystemTime",
                    description: "Get the current system time in milliseconds",
                    parameters: [],
                    returnType: "number",
                    returnDescription: "Current system time in milliseconds",
                },
            ],
        },
        {
            name: "Advanced",
            functions: [
                {
                    name: "CreateIG_answer",
                    description: "Create an interface element for drawing",
                    parameters: [],
                    returnType: "table",
                    returnDescription: "New interface element",
                },
                {
                    name: "DrawTextAt",
                    description: "Draw text on the screen",
                    parameters: [
                        {
                            name: "element",
                            type: "table",
                            description: "Interface element to draw",
                            defaultValue: "",
                        },
                    ],
                    returnType: "void",
                    returnDescription: "No return value",
                },
                {
                    name: "DrawListBox",
                    description: "Draw a list box on the screen",
                    parameters: [
                        {
                            name: "element",
                            type: "table",
                            description: "Interface element to draw",
                            defaultValue: "",
                        },
                    ],
                    returnType: "void",
                    returnDescription: "No return value",
                },
                {
                    name: "GatherEvents_chat_check",
                    description: "Get recent chat messages",
                    parameters: [],
                    returnType: "table",
                    returnDescription: "Table of chat messages",
                },
                {
                    name: "VB_FindPSett",
                    description: "Find a player setting by ID",
                    parameters: [
                        {
                            name: "settingId",
                            type: "number",
                            description: "The setting ID to find",
                            defaultValue: "",
                        },
                    ],
                    returnType: "table",
                    returnDescription: "The player setting",
                },
                {
                    name: "Compare2874Status",
                    description: "Compare a specific game status",
                    parameters: [
                        {
                            name: "statusId",
                            type: "number",
                            description: "The status ID to check",
                            defaultValue: "",
                        },
                        {
                            name: "expectedValue",
                            type: "boolean",
                            description: "The expected value",
                            defaultValue: "true",
                        },
                    ],
                    returnType: "boolean",
                    returnDescription: "True if status matches expected value",
                },
                {
                    name: "ScriptRuntimeString",
                    description: "Get the script runtime as a formatted string",
                    parameters: [],
                    returnType: "string",
                    returnDescription: "The script runtime as a string",
                },
                {
                    name: "Read_LoopyLoop",
                    description: "Check if the script should continue running",
                    parameters: [],
                    returnType: "boolean",
                    returnDescription: "True if the script should continue",
                },
                {
                    name: "Write_LoopyLoop",
                    description: "Set whether the script should continue running",
                    parameters: [
                        {
                            name: "value",
                            type: "boolean",
                            description: "Whether to continue running",
                            defaultValue: "true",
                        },
                    ],
                    returnType: "void",
                    returnDescription: "No return value",
                },
            ],
        },
    ]
}

