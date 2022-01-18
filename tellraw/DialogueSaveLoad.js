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
                AddExplanation(namePrefix);
                if(childlessPlayerResponse)  {
                    alert("One or more of the player responses in your dialogue does not have an NPC dialogue line as its child. These player responses will not have a click event added to them.");
                }
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
/**
 * Things yet to do:
 * - Conditionals
 * - Actions
 * - Player response links
 * - avoid newlines??
 * Things done:
 * - transferring tellraw properly
 * - NPC line links
 */
function CreateMCFunctions(dia) {
    let result = [];
    let cacts = []; //action file contents
    if(dia.tellraw == "ROOT") {
        dia.children.forEach((child) => {
            result = result.concat(CreateMCFunctions(child));
        });
    } else {
        if(dia.NPC) {
            let currentMCF = CreateNPC(dia);
            dia.children.forEach((child) => {
                currentMCF += CreatePlayer(child);
                //cacts.push(CreateChildCAct(child));
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
    content +=  dia.tellraw[0] == '/' ? dia.tellraw.substr(1).replace(/\n+/g, '') + "\n" : dia.tellraw.replace(/\s+/g, '') + "\n";
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
        if(dia.children[0].link) {
            newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @p trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].link + '"},' + dia.tellraw.slice(splitIndex);
        } else {
            newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"),  splitIndex) + '"clickEvent":{"action":"run_command","value":"' + '/execute if score @p trdg_' + namePrefix + '_lock' + dia.seqNum +' matches 1.. run function generated_tellraw:' + namePrefix + '/' + namePrefix + dia.children[0].seqNum + '"},' + dia.tellraw.slice(splitIndex);
        }
    } else {
        newTellraw = dia.tellraw.slice(dia.tellraw.indexOf("tellraw"));
        childlessPlayerResponse = true;
    }
    return newTellraw.replace(/\n+/g, '') + "\n";
}

function CreateChildCAct(dia) {
    let tro = ImportTellrawCode(false, dia.tellraw);
    let splitIndex = dia.tellraw.indexOf("text") + 6 + tro[0].value.text.length + 3;
    let conditionLock = 'execute if score @p ' + namePrefix + '_lock' + dia.seqNum +' >= 1 run ' //naming convention ex: delphina_lock13;
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

function AddMCFuncLink(name, content) {
    let link = document.createElement("A");
    let br = document.createElement("BR");
    let img = document.createElement("IMG");
    var blob = new Blob([content], {type: "text/plain"});
    link.download = name + ".mcfunction";
    link.href = window.URL.createObjectURL(blob);
    link.innerText = link.download;
    img.src = "Images/BookLink.png";
    document.getElementById("MCFunc-downloads").prepend(link);
    document.getElementById("MCFunc-downloads").prepend(img);
    document.getElementById("MCFunc-downloads").prepend(br);
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
    contents += 'function generated_tellraw:' + namePrefix + '/' + 'start'
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