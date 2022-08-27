function Save() {
    document.getElementById("save-loading").style.display = "inline";
    let aPromise = function aPromiseFunc(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var code = JSON.stringify(DiaToJSON(dialogue));
                var blob = new Blob([code], {type: "application/json"});
                var autoLink = document.createElement("a");
                let name = prompt("Save this dialogue project as:", Date().replaceAll(' ', '').substring(3, 12));

                name = RestrictSpecialCharacters(name, "The name you entered is not a valid file name", "Save this dialogue project as: ", Date().replaceAll(' ', '').substring(3, 12));
                if(name == null) {
                    reject();
                    return;
                }
                autoLink.download = name + ".json";
                
                autoLink.href = window.URL.createObjectURL(blob);
                autoLink.click();
            
                resolve();
            }, 100);
        });
    };
    aPromise().then(() => {
        document.getElementById("save-loading").style.display = "none";
        alert("Saved to your default (downloads) folder.");
    }).catch(() => {
        document.getElementById("save-loading").style.display = "none";
        //ignore errors
    });
}

var importFile;
function FileUpdater(event) {
    sequenceNum = 0;
    importFile = event.target.files[0].text().then((data) => {
        dialogue = JSONToDia(JSON.parse(data));
        sequenceNum++; //this is necessary to ensure the next object does not have intesecting sequence numbers
        RefreshMainWindow();
    }).catch((e) => {
        alert("The file you entered could not be read properly. Ensure you are importing the proper JSON.");
    });
}

/**
 * Incomplete. Awaiting action system to be set-up & understood within the dialogue and JSON objects before converting
 * to MCFUNCTION.
 * 
 * Reasons:
 *  - Player Response locking (for previous dialogues, will require a scoreboard system)
 *  - Only player response actions need a seperate MCFUNCTION before continuing to the next dialogue (NPC actions can be run just before outputting dialogue)
 */
var namePrefix;
function Export() {
    document.getElementById("export-loading").style.display = "inline";
    childlessPlayerResponse = false;
    let aPromise = function aPromiseFunc(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                namePrefix = prompt("Enter a prefix to associate with this dialgoue in the MCFUNCTION suite.", "dialogue");
                namePrefix = RestrictSpecialCharacters(namePrefix, "Special characters will not work for MCFUNCTION files", "Enter a prefix to associate with this dialgoue in the MCFUNCTION suite.", namePrefix);
                namePrefix = EnforceMCFuncCharacterConstraints(namePrefix, "MCFUNCTION files require the name to be all lowercase.", "Enter a prefix to associate with this dialgoue in the MCFUNCTION suite.", namePrefix);
                if(namePrefix == null) {
                    reject();
                    return;
                }
                let MCFuncs = CreateMCFunctions(dialogue);
                if(MCFuncs.length == 0) {
                    alert("No dialogue was present to export");
                    reject();
                    return;
                }
                AddMCFuncLink("init", CreateInitFile(dialogue));
                AddMCFuncLink("lock", CreateLockFile(dialogue));
                AddMCFuncLink("start", CreateStartFile(dialogue));
                MCFuncs.forEach((func) => {
                    let seqNum = parseInt(func.slice(145));
                    AddMCFuncLink(namePrefix + "" + seqNum, func);
                });
                transitions.forEach((transition) => {
                    let seqNum = parseInt(transition.slice(66));
                    AddMCFuncLink(namePrefix + seqNum + "_transition", transition);
                })
                AddExplanation(namePrefix);
                if(childlessPlayerResponse)  {
                    alert("One or more of the player responses in your dialogue does not have an NPC dialogue line as its child. These player responses will not have a click event added to them.");
                }
                overPercentageWarned = false;
                underPercentageWarned = false;
                resolve();
            }, 100);
        });
    };
    aPromise().then(() => {
        document.getElementById("export-loading").style.display = "none";
        document.querySelector("#MCFunc-downloads div.button button").style.display = "inline-block";
    }).catch((e) => {
        //ignore errors
        document.getElementById("export-loading").style.display = "none";
    });
}

var transitions = []; //action file contents

/**
 * Things yet to do:
 * - Conditionals
 * - Actions
 * Things done:
 * - transferring tellraw properly
 * - NPC line links
 * - Player links
 * - avoid newlines
 */
function CreateMCFunctions(dia) {
    let result = [];
    if(dia.tellraw == "ROOT") {
        dia.children.forEach((child) => {
            result = result.concat(CreateMCFunctions(child));
        });
    } else {
        if(dia.NPC) {
            let currentMCF = CreateNPC(dia);
            dia.children.forEach((child) => {
                currentMCF += CreatePlayer(child);
            });
            result.push(currentMCF);
        }
        dia.children.forEach((child) => {
            result = result.concat(CreateMCFunctions(child));
        });
    }
    return result;
}

function CreateNPC(dia) {
    let content = "# This code generated by Twined_Rope's Tellraw Generator (https://twinedrope.github.io/tellraw/TellrawGenerator.html)\n#Generated Dialgoue | Seq: " + dia.seqNum + "\n";
    content += 'function generated_tellraw:' + namePrefix + '/lock\n';
    dia.actions.forEach((action) => {
        content += action + "\n";
    });
    content += dia.tellraw[0] == '/' ? dia.tellraw.substr(1).replace(/\n+/g, '') + "\n" : dia.tellraw.replace(/\s+/g, '') + "\n";
    dia.children.forEach((child) => {
        content += 'scoreboard players set @s trdg_' + namePrefix + '_lock' + child.seqNum + ' 1\n';
    });
    return content;
}

var childlessPlayerResponse = false;
function CreatePlayer(dia) {
    //grab 1st tellraw text
    //add a clickevent (globally) to the first
    let tro = ImportTellrawCode(false, dia.tellraw);
    let splitIndex = dia.tellraw.indexOf("text") + 6 + tro[0].value.text.length + 3;
    let newTellraw = "";
    if(dia.children[0]) {
        if(dia.actions.length == 0 && dia.children.length == 1) {
            if(dia.children[0].link) {
                newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + PreNPCConditions(dia.children[0]) + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].link + '"},' + dia.tellraw.slice(splitIndex);
            } else {
                newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + PreNPCConditions(dia.children[0]) + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].seqNum + '"},' + dia.tellraw.slice(splitIndex);
            }
        } else {
            if(dia.children[0].link) {
                newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.seqNum + '_transition"},' + dia.tellraw.slice(splitIndex);
                transitions.push(CreateTransitionFile(dia, true, splitIndex));
            } else {
                newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.seqNum + '_transition"},' + dia.tellraw.slice(splitIndex);
                transitions.push(CreateTransitionFile(dia, false, splitIndex));
            }
        }
    } else if(!dia.link) {
        newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"));
        childlessPlayerResponse = true;
        if(dia.actions.length > 0) {
            transitions.push(CreateTransitionFile(dia, false));
        }
    } else { //If we are a player dialogue link (that is also obviously childless)
        let realPlayerDialogue = FindBySeqNum(dialogue, dia.link);
        if(realPlayerDialogue.actions.length == 0 && realPlayerDialogue.children.length == 1) {
            if(realPlayerDialogue.children[0].link) {
                newTellraw = realPlayerDialogue.tellraw.slice(realPlayerDialogue.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + PreNPCConditions(realPlayerDialogue.children[0]) + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + realPlayerDialogue.children[0].link + '"},' + realPlayerDialogue.tellraw.slice(splitIndex);
            } else {
                newTellraw = realPlayerDialogue.tellraw.slice(realPlayerDialogue.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + PreNPCConditions(realPlayerDialogue.children[0]) + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + realPlayerDialogue.children[0].seqNum + '"},' + realPlayerDialogue.tellraw.slice(splitIndex);
            }
        } else {
            if(realPlayerDialogue.children[0].link) {
                newTellraw = realPlayerDialogue.tellraw.slice(realPlayerDialogue.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + realPlayerDialogue.seqNum + '_transition"},' + realPlayerDialogue.tellraw.slice(splitIndex);
                let transitionFile = CreateTransitionFile(realPlayerDialogue, true, splitIndex)
                if(!transitions.includes(transitionFile))
                    transitions.push(transitionFile);
            } else {
                newTellraw = realPlayerDialogue.tellraw.slice(realPlayerDialogue.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @s trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. ' + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + realPlayerDialogue.seqNum + '_transition"},' + realPlayerDialogue.tellraw.slice(splitIndex);
                let transitionFile = CreateTransitionFile(realPlayerDialogue, false, splitIndex);
                if(!transitions.includes(transitionFile))
                    transitions.push(transitionFile);
            }
        }
    }
    if(dia.conditions.custom.length + dia.conditions.scores.length > 0) { //missing random conditions
        return PrePlayerConditions(dia) + newTellraw.replace(/\n+/g, '') + "\n";
    }
    return newTellraw.replace(/\n+/g, '') + "\n";
}

//stands for Player Response Action, when a transition file is needed
function CreateTransitionFile(dia, link) {
    //we can assume that dia.children[0] exists
    let contents = "# Transition file to run actions from a player response\n# SeqNum: " + dia.seqNum + "\n";
    dia.actions.forEach((action) => {
        contents += action + "\n";
    });
    let randomNPCSection = false;
    dia.children.forEach((child) => {
        if(child.conditions.random.length > 0) {
            randomNPCSection = true;
        }
    });
    if(dia.children.length == 1 && !randomNPCSection) {
        if(link) {
            contents += 'execute ' + PreNPCConditions(dia.children[0]) + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].link;
        } else {
            contents += 'execute ' + PreNPCConditions(dia.children[0]) + 'run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].seqNum;
        }
    } else { //deciding amongst multiple NPC options if they have conditions
        contents += "scoreboard objectives add " + namePrefix + dia.seqNum + "_transition dummy\n";
        contents += "scoreboard players set @s " + namePrefix + dia.seqNum + "_transition -1\n"; //denotes NPC line is yet to be chosen
        if(randomNPCSection)
            contents += "function math.random:get_random\n";
        dia.children.forEach((child, index) => {
            if(link) {
                contents += 'execute if score @s ' + namePrefix + dia.seqNum + "_transition matches -1 " + PreNPCConditions(child) + 'run scoreboard players set @s ' + namePrefix + dia.seqNum + "_transition " + index + "\n";
                contents += 'execute if score @s ' + namePrefix + dia.seqNum + "_transition matches " + index + " run function generated_tellraw:" + namePrefix + '/' + namePrefix + child.link + "\n";
            } else {
                contents += 'execute if score @s ' + namePrefix + dia.seqNum + "_transition matches -1 " + PreNPCConditions(child) + 'run scoreboard players set @s ' + namePrefix + dia.seqNum + "_transition " + index + "\n";
                contents += 'execute if score @s ' + namePrefix + dia.seqNum + "_transition matches " + index + " run function generated_tellraw:" + namePrefix + '/' + namePrefix + child.seqNum + "\n";
            }
        });
    }
    return contents;
}

//Missing: randomization
function PrePlayerConditions(dia) {
    let preconditions = "execute ";
    preconditions += ParseCustomConditions(dia);
    preconditions += ParseScoreConditions(dia);
    if(preconditions.length == 8)  {
        return "";
    }
    return preconditions + "run ";
}

function PreNPCConditions(dia) {
    let preconditions = "";
    preconditions += ParseCustomConditions(dia);
    preconditions += ParseScoreConditions(dia);    
    preconditions += ParseRandomConditions(dia);
    return preconditions;
}

function ParseCustomConditions(dia) {
    let conditions = "";
    dia.conditions.custom.forEach((cond) => {
        conditions += cond + " ";
    });
    return conditions;
}

function ParseScoreConditions(dia) {
    let preconditions = "";
    dia.conditions.scores.forEach((cond) => {
        let scoreboardName = cond.split(" ")[1];
        let scoreboardCondition = cond.split(" ")[2];
        let scoreboardValue = cond.split(" ")[3];
        let MCcondition = "score @s " + scoreboardName + " matches ";
        switch(scoreboardCondition) {
            case "<":
                MCcondition += ".." + (parseInt(scoreboardValue) - 1);
                MCcondition = "if " + MCcondition;
            break;
            case ">":
                MCcondition += (parseInt(scoreboardValue) + 1) + "..";
                MCcondition = "if " + MCcondition;
            break;
            case "<=":
                MCcondition += ".." + scoreboardValue;
                MCcondition = "if " + MCcondition;
            break;
            case ">=":
                MCcondition += scoreboardValue + "..";
                MCcondition = "if " + MCcondition;
            break;
            case "!=":
                MCcondition += scoreboardValue;
                MCcondition = "unless " + MCcondition;
            break;
            default:
                MCcondition += scoreboardValue;
                MCcondition = "if " + MCcondition;
            break;
        }
        preconditions += MCcondition + " ";
    });
    return preconditions;
}

let overPercentageWarned = false;
let underPercentageWarned = false;
function ParseRandomConditions(dia) { //TODO: UNTESTED - lightly tested with NPC random columns. Make it work when there is a column of Player randoms
    let randomArray = [];
    let ourIndex = -1;
    let totalPerc = 0;
    let totalWithRandom = 0;
    dia.parent.children.forEach((child, index) => {
        //NaN denotes that there was no randomization value for that line...
        randomArray[index] = parseInt(child.conditions.random);
        totalPerc += randomArray[index];
        totalWithRandom++;
        if(child.seqNum == dia.seqNum) {
            ourIndex = index;
        }
    });
    //using 99.9999 since our program floors at the 6th decimal place technically
    if(totalPerc < 99.9999 && totalWithRandom == dia.parent.children.length && !underPercentageWarned) {
        alert("1 or more NPC random conditions added up to less than 100% (only " + totalPerc + "%) meaning that the remaining " + (100 - totalPerc) + "% of the time, no response will be shown to the player for that section of dialogue.");
        underPercentageWarned = true;
    }
    if(totalPerc > 100 && !overPercentageWarned) {
        alert("1 or more NPC random conditions added up to more than 100% (" + totalPerc + "%) meaning that those responses that push the percent over 100 will have a lower chance of being shown than what was input in this tool.");
        overPercentageWarned = true;
    }
    //random from 0 to 1000000
    if(randomArray.length > 0 && randomArray[ourIndex] > 0) {
        let start = 0;
        let end = 0;
        for(var i = 0; i < ourIndex; i++) {
            if(randomArray[i])
                start += Math.floor(randomArray[i] * 10000);
        }
        end = start + Math.floor(randomArray[ourIndex] * 10000);
        return "if score *random main_score matches " + (start + 1) + ".." + end + " ";
    }
    return "";
}

//This has fragments of old code, ignore mostly
function CreateChildCAct(dia) {
    let tro = ImportTellrawCode(false, dia.tellraw);
    let splitIndex = dia.tellraw.indexOf("text") + 6 + tro[0].value.text.length + 3;
    let conditionLock = 'execute if score @s ' + namePrefix + '_lock' + dia.seqNum +' >= 1 run ' //naming convention ex: delphina_lock13;
    if(dia.children[0]) {
        if(dia.children[0].link) {
            conditionLock = 'function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].link;
        } else {
            conditionLock = 'function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].seqNum;
        }
        return conditionLock + "\n";
    } else {
        conditionLock = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"));
        childlessPlayerResponse = true;
        return undefined;
    }
}

addedMCFuncs = {};

function AddMCFuncLink(name, content) {
    //a patch fix for the multiple files issue
    if(addedMCFuncs[name]) {
        if(content >= addedMCFuncs[name]) {
            document.getElementById(name).remove();
        } else {
            return;
        }
    }

    let link = document.createElement("A");
    let br = document.createElement("BR");
    let img = document.createElement("IMG");
    var blob = new Blob([content], {type: "text/plain"});
    link.download = name + ".mcfunction";
    link.href = window.URL.createObjectURL(blob);
    link.innerText = link.download;
    link.id = name;
    img.src = "Images/BookLink.png";
    document.getElementById("MCFunc-downloads").prepend(link);
    document.getElementById("MCFunc-downloads").prepend(img);
    document.getElementById("MCFunc-downloads").prepend(br);

    addedMCFuncs[name] = content;
}

function AddExplanation(name) {
    let p = document.createElement("P");
    p.innerHTML = 'Now just put all these files into the following directory:<br><br><strong>.minecraft/saves/[YOUR WORLD FOLDER]/datapacks/function/data/generated_tellraw/functions/' + name + '/</strong><br><br>See <a href="https://minecraft.fandom.com/wiki/Function_(Java_Edition)">the Minecraft Wiki article for functions</a> for details. To start the dialogue, run the function called init via: <br><br><strong>/function generated_tellraw:' + name + '/init</strong>';
    document.getElementById("MCFunc-downloads").appendChild(p);
}

function DownloadAllMCFuncs(event) {
    document.querySelectorAll("#MCFunc-downloads > a").forEach((element) => {
        element.click();
    })
}

function RestrictSpecialCharacters(name, newPrompt, oldPrompt, promptDefault) {
    var newName = name;
    while(newName != null && (newName.indexOf(".") != -1 || newName.indexOf("/") != -1)) {
         newName = prompt(newPrompt + "\n" + oldPrompt, promptDefault);
    }
    return newName; //may not be new...
}

function EnforceMCFuncCharacterConstraints(name, newPrompt, oldPrompt, promptDefault) {
    var newName = name;
    while(newName != null && newName.toLowerCase() != newName) {
         newName = prompt(newPrompt + "\n" + oldPrompt, promptDefault);
    }
    return newName; //may not be new...
}
var ChildSeqNums = [];

//creates unnecessary lock scores
function CreateInitFile(dia) {
    let contents = "# This code generated by Twined_Rope's Tellraw Generator (https://twinedrope.github.io/tellraw/TellrawGenerator.html)\n# Initialization file for " + namePrefix + ' | run this dialogue by running: "/function generated_tellraw:' + namePrefix + '/init"\n';
    document.querySelectorAll("#main-window .text").forEach((element) => {
        contents += 'scoreboard objectives add trdg_' + namePrefix + '_lock' + element.getAttribute("seq") + ' dummy "' + namePrefix + '_lock' + element.getAttribute("seq") + '"\n';
    });
    if(numRandomConditions > 0 || true) {
        //random scoreboard should be created via Antoha's load function
        contents += "scoreboard players set *random_min main_score 1\n"; //starts at 1 to remove bias of 1/1000000 towards the first option
        contents += "scoreboard players set *random_max main_score 1000000\n";
    }
    contents += 'function generated_tellraw:' + namePrefix + '/' + 'start';
    return contents;
}

function CreateLockFile(dia) {
    let contents = "# This code generated by Twined_Rope's Tellraw Generator (https://twinedrope.github.io/tellraw/TellrawGenerator.html)\n# Locks all player options " + namePrefix + ' | run this dialogue by running: "/function generated_tellraw:' + namePrefix + '/init"\n';
    document.querySelectorAll("#main-window .text").forEach((element) => {
        contents += 'scoreboard players set @s trdg_' + namePrefix + '_lock' + element.getAttribute("seq") + ' 0\n';
    });
    return contents;
}

function CreateStartFile(dia) {
    //we will put some conditional stuff here!
    return 'function generated_tellraw:' + namePrefix + '/' + namePrefix + '1'
}