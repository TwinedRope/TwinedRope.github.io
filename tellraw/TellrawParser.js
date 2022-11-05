/**
 * Test input...:
 * /tellraw @p {"text":"","extra":[{"text":"[","color":"white"},{"text":"Jeffrey Gaydos","color":"aqua","hoverEvent":{"action":"show_text", "value":"AKA Twined_Rope"}},{"text":"]: Hello and welcome to the ","color":"white"},{"text":"Keep on the Shadowfell","color":"gold","hoverEvent":{"action":"show_text", "value":"A map related to a D&D lvl 1 adventure"}},{"text":" map! Yes, I am ","color":"white"},{"text":"Twined_Rope","color":"blue","hoverEvent":{"action":"show_text", "value":"AKA Jeffrey Gaydos"}},{"text":", the creator of the tellraw generator. Check it out!\n","color":"white"},{"text":"-Continue-","color":"dark_green","clickEvent":{"action":"run_command", "value":"say continue"}}]}
 */

const alertLvl = {
    all: 3,
    fatal: 2,
    none: 1
};

const nonFatalBeforeMessage = "The tellraw code you entered does not appear to be correct for Minecraft. ";
const nonFatalAfterMessage = "\n\nThis error can be ignored using the \"Ignore tellraw parse errors\" checkbox.";
const fatalAfterMessage = "\n\nThis error can NOT be ignored by this tool";

function TellrawToHTML(tellraw, alertLevel = alertLevel.all) {
    if(tellraw.indexOf("tellraw") != 0 && tellraw.indexOf("tellraw") != 1) {
        if(alertLevel == alertLvl.all) {
            alert(nonFatalBeforeMessage + "Message: [Expected \"tellraw\" keyword]." + nonFatalAfterMessage);
            return;
        }
    } else {
        tellraw = tellraw.slice(8 + tellraw.indexOf("tellraw")); //remove "tellraw", the space, and the "/" if present
    }

    if(tellraw.indexOf("@") != 0) {
        if(alertLevel == alertLvl.all) alert(nonFatalBeforeMessage + "Message: [Expected \"@\" for target selector]" + nonFatalAfterMessage);
        return;
    } else if(tellraw[tellraw.indexOf("@") + 2] == '[') {
        if(tellraw.indexOf("]") == -1) {
            if(alertLevel == alertLvl.all) alert(nonFatalBeforeMessage + "Message: [Expected \"]\" to close the target selector]" + nonFatalAfterMessage);
            return;
        } else {
            tellraw = tellraw.slice(tellraw.indexOf("]") + 2);
        }
    } else {
        tellraw = tellraw.slice(3);
    }

    var TRJ;
    try {
        TRJ = JSON.parse(tellraw);
    } catch {
        if(alertLevel >= alertLvl.fatal) alert("The tellraw JSON object could not be parsed; check for a missing brace or comma." + fatalAfterMessage);
        return;
    }

    var TRO = [];
    TRO.push({});
    TRO[0].value =  RawToGenOutput(TRJ, 0);
    if(TRJ['extra']) {
        for(var i = 0; i < TRJ['extra'].length; i++) {
            TRO.push({});
            TRO[i + 1].value = RawToGenOutput(TRJ['extra'][i]);
        }
    }
    var outputCharacterElements = [];
    TRO.forEach((item, index) => {
        var character = document.createElement("SPAN");
        character.setAttribute("index", index);
        if(item.value.text == ' ')
            character.classList.add("space");
        character.innerHTML = item.value.text == ' ' ? '' : item.value.text;
        if(item.value.format)
            item.value.format.forEach((ft) => character.classList.add(ft));
        if(item.value.event[0]) {
            character.classList.add("click-event");
            character.addEventListener("click", (event) => ShowClickEvent(event, index));
            character.addEventListener("onmouseenter", () => HintClickEvent());
            character.addEventListener("onmouseleave", () => RemoveShowClickEvent());
        } else if(item.value.event[1]) {
            character.classList.add("hover-event");
            character.addEventListener("click", (event) => ShowHoverEvent(event, index));
            character.addEventListener("onmouseout", () => RemoveShowHoverEvent());
        }
        if((cursorPosition == 0 && index == 0 || cursorPosition - 1 == index && lastSelection.length == 0) || IsInLastSelection(index)) {
            character.classList.add("cursor-selected");
            character.style.border = `1px solid ${item.value.color}`;
        }
        character.style.color = item.value.color;
        if(item.value.text == '\n')
            outputCharacterElements.push(document.createElement("BR"));
        outputCharacterElements.push(character);
    });
    return outputCharacterElements;
}

function ImportTellrawCode(dialogue = false, TRInput = undefined, alertLevel = alertLvl.all) {
    var input = TRInput ? TRInput : document.getElementById("input").value;
    if(input.indexOf("tellraw") != 0 && input.indexOf("tellraw") != 1) {
        if(alertLevel == alertLvl.all) {
            alert(nonFatalBeforeMessage + "Message: [Expected \"tellraw\" keyword]." + nonFatalAfterMessage);
            return;
        }
    } else {
        input = input.slice(8 + input.indexOf("tellraw")); //remove "tellraw", the space, and the "/" if present
    }

    if(input.indexOf("@") != 0) {
        if(alertLevel == alertLvl.all) alert(nonFatalBeforeMessage + "Message: [Expected \"@\" for target selector]" + nonFatalAfterMessage);
        return;
    } else if(input[input.indexOf("@") + 2] == '[') {
        if(input.indexOf("]") == -1) {
            if(alertLevel == alertLvl.all) alert(nonFatalBeforeMessage + "Message: [Expected \"]\" to close the target selector]" + nonFatalAfterMessage);
            return;
        } else {
            input = input.slice(input.indexOf("]") + 2);
        }
    } else {
        input = input.slice(3);
    }

    var TRJ;
    try {
        TRJ = JSON.parse(input);
    } catch {
        if(alertLevel >= alertLvl.fatal) alert("The tellraw JSON object could not be parsed; check for a missing brace or comma." + fatalAfterMessage);
        return;
    }

    var TRO = [];
    TRO.push({});
    TRO[0].value =  RawToGenOutput(TRJ, 0);
    if(TRJ['extra']) {
        for(var i = 0; i < TRJ['extra'].length; i++) {
            TRO.push({});
            TRO[i + 1].value = RawToGenOutput(TRJ['extra'][i]);
        }
    }

    outputArray = [];
    if(dialogue) {
        let tellraw = document.getElementById("input").value;
        document.getElementById("input").value = GenOutputToOutputArray(TRO);    
        document.getElementById("input").click();
        document.getElementById("input").value = tellraw
    } else {
        document.getElementById("input").value = GenOutputToOutputArray(TRO);
        document.getElementById("input").click();
    }

    return TRO;
}

function RawToGenOutput(rj) {
    var TRO = {};
    TRO.text = rj['text'];
    TRO.color = ColorEncodeMCHex[rj['color']] == undefined ? 'white' : ColorEncodeMCHex[rj['color']];
    
    TRO.event = [];

    var CEObj = {};
    CEObj.clickEvent = true;
    CEObj.value = rj['clickEvent'] == undefined ? undefined : rj['clickEvent']['value'];
    TRO.event[0] = CEObj.value == undefined ? undefined : CEObj;
    if(CEObj == {}) {
        CEObj = undefined;
    }

    var HEObj = {};
    HEObj.clickEvent = false;
    HEObj.value = rj['hoverEvent'] == undefined ? undefined : rj['hoverEvent']['value'];
    TRO.event[1] = HEObj.value == undefined ? undefined : HEObj;
    if(HEObj == {}) {
        HEObj = undefined;
    }

    var FObj = [];
    if(rj['bold'] != undefined) {
        if(rj['bold'] == "true") {
            FObj.push('bold');
        }
    }
    if(rj['italic'] != undefined) {
        if(rj['italic'] == "true") {
            FObj.push('italic');
        }
    }
    if(rj['underline'] != undefined) {
        if(rj['underline'] == "true") {
            FObj.push('underline');
        }
    }
    if(rj['strikethrough'] != undefined) {
        if(rj['strikethrough'] == "true") {
            FObj.push('strikethrough');
        }
    }
    if(rj['obfuscated'] != undefined) {
        if(rj['obfuscated'] == "true") {
            FObj.push('obfuscated');
        }
    }
    if(rj['font'] != undefined) {
        if(rj['font'] == "minecraft:alt") {
            FObj.push('enchanted');
        }
    }
    if(FObj == []) {
        FObj = undefined;
    }
    TRO.format = FObj;
    return TRO;
}

function GenOutputToOutputArray(tro) {
    var str = "";
    for(var i = 0; i < tro.length; i++) {
        var currentColor = tro[i].value.color;
        var currentFormats = tro[i].value.format;
        var currentEvents = tro[i].value.event;
        for(var j = 0; j < tro[i].value.text.length; j++) {
            var outputObj = {};
            outputObj.val = tro[i].value.text[j];
            str += tro[i].value.text[j];
            outputObj.color = currentColor;
            outputObj.format = currentFormats;
            outputObj.event = currentEvents;
            outputArray.push(outputObj);
        }
    }
    return str;
}