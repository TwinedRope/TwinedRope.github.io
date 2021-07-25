/**
 * Known Bugs:
 * - Nothing here!
 * 
 * Improvements:
 * - Performance: Breaks down at 800 characers currently
 *      - Opportunity for optimization lies in the word break mechanics
 */

var cursorPosition = 0; //WARNING: lazily updated
var outputArray = []; //should be an array of objects, with th objects containing all the metadat necessary for formatting, events, etc.
//index of this array represents the position of the character (which should be cursorPosition - 1)
var outputBox;
var outputBoxWidth;
var outputHTMLString;

var lastSelection = {
    length: 0,
    startIndex: 0,
    endIndex: 0
};

function Initialize() {
    outputBox = document.getElementsByClassName("current-output")[0];
    outputBoxWidth = outputBox.clientWidth;
    InitEvents();
    FormatInit();
}

function UpdateOutputBoxWidth() {
    if(outputBox != undefined) {
        outputBoxWidth = outputBox.clientWidth;
        RefreshOutput();
    }
}

function CalculateOutput(event) {
    UpdateOutputArray(event);
}

function UpdateOutputArray(event) {
    const inputLength = event.target.value.length;
    const inputLengthDelta = inputLength - outputArray.length;
    event.target.value[0];
    if(inputLengthDelta > 0) {
        for(var i = event.target.selectionStart - inputLengthDelta; i < event.target.selectionStart; i++) {
            char = {
                val: event.target.value[i],
                color: currentColor,
                event: [],
                format: currentFormats == [] ? [] : Array.from(currentFormats)
            }
            outputArray.splice(i, 0, char); //inserts new characters when needed
        }
    }
    UpdateCursorPosition(event);
}

function TranslateToHTML(item, index) {
    const _space = item.val == ' ' ? 'space ' : '';
    const _letter = item.val == ' ' ? '' : item.val;
    const _clickEvent = item.event[0] == undefined ? '' : 'click-event ';
    const _clickEventHandler = item.event[0] == undefined ? '' : 'onclick="ShowClickEvent(event, ' + index + ')" onmouseenter="HintClickEvent()" onmouseleave="RemoveShowClickEvent()" ';
    const _hoverEvent = item.event[1] == undefined ? '' : 'hover-event ';
    const _hoverEventHandler = item.event[1] == undefined ? '' : 'onmouseover="ShowHoverEvent(event, ' + index + ')" onmouseout="RemoveShowHoverEvent()" ';
    const _format = item.format.toString().replaceAll(",", " ");
    if((cursorPosition == 0 && index == 0 || cursorPosition - 1 == index && lastSelection.length == 0) || IsInLastSelection(index)) {
        HTMLString = "<span " + _clickEventHandler + _hoverEventHandler + " class=\"" + _space + _clickEvent + _hoverEvent + _format + " cursor-selected\" style=\"border: 1px solid " + item.color + "; color: " + item.color + ";\">" + _letter + "</span>";
    } else {
        HTMLString = "<span " + _clickEventHandler + _hoverEventHandler + "class=\"" + _space + _clickEvent + _hoverEvent + _format + "\" style=\"color: " + item.color + ";\">" + _letter + "</span>";
    }
    outputHTMLString += HTMLString; //kept in string type for performance reasons
}

function RefreshOutput() {
    if(outputBox != undefined) {
        outputHTMLString = '';
        outputBox.innerHTML = '';
        outputArray.forEach(TranslateToHTML);
        outputBox.appendChild(document.createRange().createContextualFragment(outputHTMLString));
        PostProcessFormats();
        for(var i = 0; i < outputBox.childElementCount; i++) {
            if(AddBreaks(outputBox.children[i]))
                i++;
        }
        PerformanceWarnings();
    }
}

function AddBreaks(item) {
    if(item.offsetLeft + 18.02 >= outputBoxWidth) {
        const breakEl = document.createElement("br");
        item.parentElement.insertBefore(breakEl, item);
        return true;
    }
}

function KeyUpEventUpdate(event) {
    UpdateCursorPositionArrows(event);
}

function KeyDownEventUpdate(event) {
    UpdateOutputDeletion(event);
    InterceptCTRLA(event);
}

function UpdateOutputDeletion(event) {
    const selection = GetSelection(event);
    if(selection.length == 0) {
        if(event.keyCode == 8) {//backspace
            outputArray.splice(selection.startIndex - 1, 1);
        }
        if(event.keyCode == 46) {//delete
            outputArray.splice(selection.startIndex, 1);
        }
    } else {
        if(KeyChangesLength(event.keyCode, event.ctrlKey)) {
            outputArray.splice(selection.startIndex, selection.length);
        }
    }
}

const inputKeys = [8, 9, 13, 46, 219, 220, 221, 222]; //these keys cause the length to change
function KeyChangesLength(kc, ctrlKey) {
    return ((kc >= 48 && kc <= 90 && !ctrlKey) || inputKeys.indexOf(kc) != -1 || (kc >= 96 && kc <= 111) || (kc >= 186 && kc <= 192));
}

function UpdateCursorPositionClick(event) {
    UpdateCursorPosition(event);
    setTimeout(UpdateCursorPosition.bind(null, event), 50); //current solution for udpating the highlight output to be accurate. Will break down with lag, but it is also purely a visual fix
}

function UpdateCursorPositionArrows(event) {
    //Keycodes in the range 33-40 are the arrow keys' codes, home, end, page up, and page down
    if(event.keyCode <= 40 && event.keyCode >= 33) {
        UpdateCursorPosition(event);
    }
}

function UpdateCursorPosition(event) {
    //console.log(event.target.selectionStart);
    cursorPosition = event.target.selectionStart;
    lastSelection = GetSelection(event);
    RefreshOutput();
    if(outputArray.length > 0) {
        UpdateCurrentColor();
        UpdateCurrentEvents('click');
        UpdateCurrentEvents('hover');
        UpdateCurrentFormat();
    }
}

//must be on an event that has a target
function GetSelection(event) {
    return {
        startIndex: event.target.selectionStart,
        endIndex: event.target.selectionEnd,
        length: event.target.selectionEnd - event.target.selectionStart
    };
}

function FocusEventHighlight(event) {
    const selection = GetSelection(event);
    if(selection.length > 0) {
        if(colorHighlightFlag)
            ColorHighlight(selection);
        if(eventRemoveFlag != '')
            EventRemoveHighlight(selection);
        if(formatFlag)
            FormatHighlight(selection);
        if(clearFormatFlag)
            ClearAllFormatHighlight(selection);
    } else {
        if(eventRemoveFlag != '')
            EventRemoveNoHighlight(selection);
    }

    if(eventAddFlag != '')
        RouteEditAddEvent(selection);
    colorHighlightFlag = false;
    eventAddFlag = '';
    eventRemoveFlag = '';
    formatFlag = false;
    clearFormatFlag = false;
}

function HandleOutputSelection(event) {
    lastSelection = GetSelection(event);
    //RefreshOutput(); - see UpdateCursorPosition
}

function IsInLastSelection(index) {
    return (index >= lastSelection.startIndex && index < lastSelection.endIndex);
}

function InterceptCTRLA(event) {
    if(event.ctrlKey && event.keyCode == 65) {
        lastSelection = {
            startIndex: 0,
            endIndex: event.target.value.length,
            length: event.target.value.length
        };
        RefreshOutput();
    }
}

function TransferClickParent(event) {
    event.preventDefault();
    event.target.parentElement.click();
}