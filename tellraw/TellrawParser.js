/**
 * Test input...:
 * /tellraw @p {"text":"","extra":[{"text":"[","color":"white"},{"text":"Jeffrey Gaydos","color":"aqua","hoverEvent":{"action":"show_text", "value":"AKA Twined_Rope"}},{"text":"]: Hello and welcome to the ","color":"white"},{"text":"Keep on the Shadowfell","color":"gold","hoverEvent":{"action":"show_text", "value":"A map related to a D&D lvl 1 adventure"}},{"text":" map! Yes, I am ","color":"white"},{"text":"Twined_Rope","color":"blue","hoverEvent":{"action":"show_text", "value":"AKA Jeffrey Gaydos"}},{"text":", the creator of the tellraw generator. Check it out!\n","color":"white"},{"text":"-Continue-","color":"dark_green","clickEvent":{"action":"run_command", "value":"say continue"}}]}
 */

function ImportTellrawCode(dialogue = false, TRInput = undefined) {
    var input = TRInput ? TRInput : document.getElementById("input").value;
    if(input.indexOf("tellraw") != 0 && input.indexOf("tellraw") != 1) {
        alert("The tellraw code you entered is not able to be properly parsed. Check for syntax errors.");
        return;
    } else {
        input = input.slice(8 + input.indexOf("tellraw")); //remove "tellraw", the space, and the "/" if present
    }

    if(input.indexOf("@") != 0) {
        alert("The tellraw code you entered is not able to be properly parsed. Check for syntax errors.");
        return;
    } else if(input[input.indexOf("@") + 2] == '[') {
        if(input.indexOf("]") == -1) {
            alert("The tellraw code you entered is not able to be properly parsed. Check for syntax errors.");
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
        alert("The tellraw code you entered is not able to be properly parsed. Check for syntax errors.");
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