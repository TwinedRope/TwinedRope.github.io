/**
 * EVENTS:
 * Highlight the text you want to add the click event to, then type in a command and click button to add
 * make command appear when cursor is at text (measured from previous letter[or first letter for when you are at index 0])
 *      If this command is edited, any letters adjacent to the currently selected letter are modified
 * click a group of colored letters, add an event, triggers for the entire block of adjacent colored text (ignores any format changes it encounters)
 * hover events are hoverable
 * click events are clickable
 * checkboxes to highlight where click and hover events are
 */
var currentEvent;
var currentEvents = [];
var eventAddFlag = '';
var eventRemoveFlag = '';
var eventEditFlag = '';

var clickNotifBox;
var hoverNotifBox;
var hoverBox = document.createElement("div");

var hoverStylesheet = document.createElement("link");
var clickStylesheet = document.createElement("link");;
var bothStylesheet = document.createElement("link");;

function InitEvents() {
    hoverStylesheet.rel = "stylesheet";
    hoverStylesheet.href = "HoverEvents.css";
    clickStylesheet.rel = "stylesheet";
    clickStylesheet.href = "ClickEvents.css";
    bothStylesheet.rel = "stylesheet";
    bothStylesheet.href = "BothEvents.css";

    clickNotifBox = document.getElementById("click-notification-box");
    hoverNotifBox = document.getElementById("hover-notification-box");

    hoverBox.classList.add("hover-box");
    var hoverBoxInner = document.createElement("div");
    hoverBoxInner.classList.add("hover-box-inner");
    hoverBox.appendChild(hoverBoxInner);
}

//this function is only called when there is no highlight and we are clicking the add event button
function RouteEditAddEvent(selection) {
    const newValue = document.getElementById(eventAddFlag + "-event-input").value;
    if(selection.length > 0) {
        if(newValue.length == 0) {
            eventRemoveFlag = eventAddFlag;
            EventRemoveHighlight(selection);
        } else {
            EventHighlight(selection);
        }
        return;
    }
    const actualStartIndex = selection.startIndex == 0 ? 0 : selection.startIndex - 1;
    const eventIndex = eventAddFlag == 'click' ? 0 : 1;

    if(outputArray[actualStartIndex].event[eventIndex] != undefined && outputArray[actualStartIndex].event[eventIndex].value != newValue) {
        if(newValue.length == 0) {
            eventRemoveFlag = eventAddFlag;
            EventRemoveNoHighlight(selection);
        } else {
            eventEditFlag = eventAddFlag;
            EventEdit(selection);
        }
        return;
    }

    if(outputArray[actualStartIndex].event[eventIndex] == undefined) {
        EventAddByFormatColor(selection);
        return;
    }
}

function AddEvent(type) {
    eventMC = {
        clickEvent: (type === 'click'),
        value: document.getElementById(type + '-event-input').value
    };
    currentEvent = eventMC;
    eventAddFlag = type;
    document.getElementById("input").focus();
}

function EventHighlight(selection) {
    if(currentEvent.clickEvent) {
        for(var i = selection.startIndex; i < selection.endIndex; i++) {
            outputArray[i].event[0] = currentEvent;
        }
    } else {
        for(var i = selection.startIndex; i < selection.endIndex; i++) {
            outputArray[i].event[1] = currentEvent;
        }
    }
    RefreshOutput();
}

function UpdateCurrentEvents(type) {
    try {
        const eventIndex = type == 'click' ? 0 : 1;
        if(lastSelection.length > 0) {
            currentEvents[eventIndex] = outputArray[cursorPosition].event[eventIndex];
        } else {
            currentEvents[eventIndex] = cursorPosition == 0 ? outputArray[cursorPosition].event[eventIndex] : outputArray[cursorPosition - 1].event[eventIndex];
        }
        if(currentEvents[eventIndex] == undefined && lastSelection.endIndex > 0)
            currentEvents[eventIndex] = outputArray[lastSelection.endIndex - 1].event[eventIndex];

        if(currentEvents[eventIndex] != undefined) {
            document.getElementById(type + "-event-input").value = currentEvents[eventIndex].value;
        } else {
            document.getElementById(type + "-event-input").value = '';
        }
    } catch(e) {
        //ignore errors for dialogue generator
    }
}

function UpdateCurrentHoverEvent() {
    currentEvents[1] = cursorPosition == 0 ? outputArray[cursorPosition].event[1] : outputArray[cursorPosition - 1].event[1];
    if(currentEvents[1] != undefined) {
        document.getElementById("hover-event-input").value = currentEvents[1].value;
    } else {
        document.getElementById("hover-event-input").value = '';
    }
}

function RemoveEvent(type) {
    eventRemoveFlag = type;
    document.getElementById("input").focus();
}

function EventRemoveHighlight(selection) {
    const eventIndex = eventRemoveFlag == 'click' ? 0 : 1;
    for(var i = selection.startIndex; i < selection.endIndex; i++) {
        outputArray[i].event[eventIndex] = undefined;
    }
    document.getElementById(eventRemoveFlag + "-event-input").value = '';
    eventRemoveFlag = '';
    RefreshOutput();
}

function EventRemoveNoHighlight(selection) {
    const eventIndex = eventRemoveFlag == 'click' ? 0 : 1;
    var startIndexModified = false;
    if(selection.startIndex === 0) {
        selection.startIndex = 1;
        startIndexModified = true;
    }
        
    if(outputArray[selection.startIndex - 1].event[eventIndex] != undefined) {
        var eventVal = outputArray[selection.startIndex - 1].event[eventIndex].value;
        var i = 0;
        while(selection.startIndex + i < outputArray.length && outputArray[selection.startIndex + i].event[eventIndex] != undefined && outputArray[selection.startIndex + i].event[eventIndex].value == eventVal) { //TODO: Length issues - highlight on the end of the input
            outputArray[selection.startIndex + i].event[eventIndex] = undefined;
            i++;
        }
        i = -1;
        while(selection.startIndex + i >= 0 && outputArray[selection.startIndex + i].event[eventIndex] != undefined && outputArray[selection.startIndex + i].event[eventIndex].value == eventVal) {
            outputArray[selection.startIndex + i].event[eventIndex] = undefined;
            i--;
        }
    }

    if(startIndexModified)
        selection.startIndex = 0;
    document.getElementById(eventRemoveFlag + "-event-input").value = '';
    eventRemoveFlag = '';
    RefreshOutput();
}

function EventEdit(selection) {
    const eventIndex = eventEditFlag == 'click' ? 0 : 1;
    const newVal = document.getElementById(eventEditFlag + "-event-input").value;
    const newEvent = {
        clickEvent: (eventEditFlag == 'click'),
        value: newVal
    };
    var startIndexModified = false;
    if(selection.startIndex === 0) {
        selection.startIndex = 1;
        startIndexModified = true;
    }
        
    if(outputArray[selection.startIndex - 1].event[eventIndex] != undefined) {
        var eventVal = outputArray[selection.startIndex - 1].event[eventIndex].value;
        var i = 0;
        while(selection.startIndex + i < outputArray.length && outputArray[selection.startIndex + i].event[eventIndex] != undefined && outputArray[selection.startIndex + i].event[eventIndex].value == eventVal) {
            outputArray[selection.startIndex + i].event[eventIndex] = newEvent;
            i++;
        }
        i = -1;
        while(selection.startIndex + i >= 0 && outputArray[selection.startIndex + i].event[eventIndex] != undefined && outputArray[selection.startIndex + i].event[eventIndex].value == eventVal) {
            outputArray[selection.startIndex + i].event[eventIndex] = newEvent;
            i--;
        }
    }

    if(startIndexModified)
        selection.startIndex = 0;
    eventEditFlag = '';
    RefreshOutput();
}

function EventAddByFormatColor(selection) {
    const eventIndex = eventAddFlag == 'click' ? 0 : 1;
    const newVal = document.getElementById(eventAddFlag + "-event-input").value;
    const newEvent = {
        clickEvent: (eventAddFlag == 'click'),
        value: newVal
    };
    var startIndexModified = false;
    if(selection.startIndex === 0) {
        selection.startIndex = 1;
        startIndexModified = true;
    }
    
    const origColor = outputArray[selection.startIndex - 1].color;
    const origFormat = outputArray[selection.startIndex - 1].format;
    var i = 0;
    while(selection.startIndex + i < outputArray.length && outputArray[selection.startIndex + i].color == origColor && MatchFormatArrays(origFormat, outputArray[selection.startIndex + i].format)) {
        outputArray[selection.startIndex + i].event[eventIndex] = newEvent;
        i++;
    }
    i = -1;
    while(selection.startIndex + i >= 0 && outputArray[selection.startIndex + i].color == origColor && MatchFormatArrays(origFormat, outputArray[selection.startIndex + i].format)) {
        outputArray[selection.startIndex + i].event[eventIndex] = newEvent;
        i--;
    }

    if(startIndexModified)
        selection.startIndex = 0;
    eventAddFlag = '';
    RefreshOutput();
}

function MatchFormatArrays(arr1, arr2) {
    if(arr1.length != arr2.length)
        return false;
    for(var i = 0; i < arr1.length; i++) {
        if(!arr2.includes(arr1[i])) {
            return false;
        }
    }
    return true;
}

function HighlightHoverEvents(event) {
    if(event.target.checked) {
        document.head.appendChild(hoverStylesheet);
    } else {
        document.head.removeChild(hoverStylesheet);
        try {
            document.head.removeChild(bothStylesheet);
        } catch(e) {
            //ignore errors
        }
    }
    if(document.getElementById("click-checkbox").checked && event.target.checked) {
        document.head.appendChild(bothStylesheet);
    } else {
        try {
        document.head.removeChild(bothStylesheet);
        } catch(e) {
            //ignore errors
        }
    }
}

function HighlightClickEvents(event) {
    if(event.target.checked) {
        document.head.appendChild(clickStylesheet);
    } else {
        document.head.removeChild(clickStylesheet);
        try {
            document.head.removeChild(bothStylesheet);
        } catch(e) {
            //ignore errors
        }
    }
    if(document.getElementById("hover-checkbox").checked && event.target.checked) {
        document.head.appendChild(bothStylesheet);
    } else {
        try {
        document.head.removeChild(bothStylesheet);
        } catch(e) {
            //ignore errors
        }
    }
}

function ShowClickEvent(event, index) {
    clickNotifBox.innerHTML = "<p>Ran command: \"" + outputArray[index].event[0].value + "\"</p>";
}

function HintClickEvent() {
    clickNotifBox.innerHTML = "<p>Text has click event</p>";
}

function RemoveShowClickEvent() {
    clickNotifBox.innerHTML = '';
}

function ShowHoverEvent(event, index) {
    const xOffset = 20;
    const yOffest = -60;
    hoverNotifBox.appendChild(hoverBox);
    hoverBox.style.top = event.clientY + yOffest;
    hoverBox.style.left = event.clientX + xOffset;
    hoverBox.children[0].innerHTML = outputArray[index].event[1].value;
}

function RemoveShowHoverEvent() {
    hoverNotifBox.removeChild(hoverBox);
}