var tellrawArray = [];
var lastOutputObject;
var currentTellrawObject;
var tellrawOutput = '';

function Submit() {
    tellrawArray = [];
    lastOutputObject = outputArray[0];
    InitTellrawObject(lastOutputObject);
    TranslateToTellrawArray(1);
    tellrawArray.forEach(TellrawOutput);
    tellrawOutput += ']}';
    document.getElementsByClassName("tellraw-output")[0].value = tellrawOutput;
}

function InitTellrawObject(initObj) {    
    currentTellrawObject = {
        value: initObj.val,
        color: ColorDecodeMC[initObj.color],
        events: initObj.event.length == 0 ? [] : Array.from(initObj.event),
        format: initObj.format.length == 0 ? [] : Array.from(initObj.format)
    };
}

function TranslateToTellrawArray(start) {
    for(var i = start; i < outputArray.length; i++) {
        if(ColorsMatch(outputArray[i], lastOutputObject) && EventsMatch(outputArray[i], lastOutputObject) && FormatsMatch(outputArray[i], lastOutputObject)) {
            currentTellrawObject.value += outputArray[i].val;      
        } else {
            tellrawArray.push(currentTellrawObject);
            InitTellrawObject(outputArray[i]);
            lastOutputObject = outputArray[i];
        }
    }
    tellrawArray.push(currentTellrawObject);
}

function ColorsMatch(outputObj1, outputObj2) {
    return (outputObj1.color == outputObj2.color);
}

function EventsMatch(outputObj1, outputObj2) {
    var clickEventsMatch = false;
    var hoverEventsMatch = false;
    if(outputObj1.event.length != outputObj2.event.length)
        return false;
    if(outputObj1.event.length == 0 && outputObj2.event.length == 0) {
        return true;
    }
    if(outputObj1.event[0] != undefined && outputObj2.event[0] != undefined && outputObj1.event[0].clickEvent == outputObj2.event[0].clickEvent && outputObj1.event[0].value == outputObj2.event[0].value) {
        clickEventsMatch = true;
    } else if(outputObj1.event[0] == undefined && outputObj2.event[0] == undefined) {
        clickEventsMatch = true;
    }
    if(outputObj1.event[1] != undefined && outputObj2.event[1] != undefined && outputObj1.event[1].clickEvent == outputObj2.event[1].clickEvent && outputObj1.event[1].value == outputObj2.event[1].value) {
        hoverEventsMatch = true;
    } else if(outputObj1.event[1] == undefined && outputObj2.event[1] == undefined) {
        hoverEventsMatch = true;
    }
    return (clickEventsMatch && hoverEventsMatch);
}

function FormatsMatch(outputObj1, outputObj2) {
    if(outputObj1.format.length == 0 && outputObj2.format.length == 0)
        return true;
    if(outputObj1.format.length != outputObj2.format.length)
        return false;
    for(var i = 0; i < outputObj1.length; i++) {
        if(!outputObj1.format.includes(outputObj2.format[i])) {
            return false;
        }
    }
    return true;
}

function TellrawOutput(item, index) {
    if(index == 0) {
        tellrawOutput = '/tellraw @p {"text":"","extra":[';
        TellrawNodeOutput(item, true);
    } else {
        TellrawNodeOutput(item, false);
    }
}

function TellrawNodeOutput(item, first) {
    if(!first)
        tellrawOutput += ',';
    tellrawOutput += '{"text":"' + item.value.replace(/\n/g, "\\n").replace(/"/g, "\\\"") + '","color":"' + item.color + '"';
    if(item.events.length != 0) {
        if(item.events[0] != undefined) {
            tellrawOutput += ',"clickEvent":{"action":"run_command", "value":"' + item.events[0].value.replace(/\n/g, "\\n").replace(/"/g, "\\\"") + '"}';
        }
        if(item.events[1] != undefined) {
            tellrawOutput += ',"hoverEvent":{"action":"show_text", "value":"' + item.events[1].value.replace(/\n/g, "\\n").replace(/"/g, "\\\"") + '"}';
        }
    }
    for(var i = 0; i < item.format.length; i++) {
        if(item.format[i] == 'enchanted') {
            tellrawOutput += ',"font":"minecraft:alt"';
        } else {
            tellrawOutput += ',"' + item.format[i] + '":"true"';
        }
    }
    tellrawOutput += '}';
}