/**
 * Dialoguegenerator.js
 * 
 * The main file with the most essential functions
 * to the tool. Everything to do with the main
 * window is done in here.
 */

const bracketE = '˪';
const bracketM = '˫';
const bracketV = '|';

var calculatedWidth = 1500;
var widthRatio = 1500 / 1920;

var clicks = 0;
var selected;
var selectedElement;

var dialogue = new DialogueObject('ROOT', [], undefined, false, false);

function DialogueInit() {
    Initialize();

    document.body.addEventListener("mouseup", function() {DeactivateDrag()});
    document.body.addEventListener("mousemove", function(event) {Drag(event)});
    document.getElementById("json-import").addEventListener("change", function(event) { FileUpdater(event); });
    window.addEventListener("resize", function() { ResizeWidthFormatting(); });
    ResizeWidthFormatting();

    RefreshMainWindow();

    let element = document.querySelector(".text");
    Select(element);

    document.querySelector("#action button").click();
    document.querySelector("#conditional button").click();

    document.body.addEventListener("keydown", (event) => { MapButtonsDown(event) });
    document.body.addEventListener("keyup", (event) => { MapButtonsUp(event) });
}

var autoSubmit = false;
var autoSubmitIntervalID;
function ToggleAutoSubmitLine() {
    autoSubmit = !autoSubmit;
    if(autoSubmit)
        SubmitLine(true, alertLvl.none);
    console.log("auto submit: " + (autoSubmit ? "on" : "off"));
}

function AutoSubmitLine() {
    if(autoSubmit) {
        SubmitLine(true, alertLvl.all);
    }
}

//NOTE: Recursive
function RenderDialogue(dia, indent = 0) {
    let dialine = document.createElement("P");
    let connector = document.createElement("SPAN");
    let diatext = document.createElement("SPAN");
    let indicator = document.createElement("IMG");
    let expandButton = document.createElement("BUTTON");
    let seqNumIndicator = document.createElement("SPAN");
    seqNumIndicator.innerText = dia.seqNum;
    seqNumIndicator.classList.add("seq-num-indicator");
    expandButton.innerHTML = dia.collapsed ? '+' : '-';
    expandButton.classList.add("expand-button");
    expandButton.addEventListener("click", function(event) { ToggleCollapse(event, dia); });
    if(dia.children.length == 0) {
        expandButton.setAttribute("disabled", "");
        expandButton.innerHTML = '';
    }
    indicator.src = dia.NPC ? "Images/Villager.png" : "Images/Player.png";
    indicator.classList.add("indicator");
    indicator.title = dia.NPC ? "NPC text" : "Player Response";
    indicator.addEventListener("click", function(event) { TransferClickToText(event); });
    dialine.classList.add("line");
    if(dia.parent != undefined) {
        indent++;
        let currentParent = dia.parent;
        for(var j = 0; j < indent; j++) {
            let indentEl;
            if(currentParent.parent != undefined && currentParent.parent.children[currentParent.parent.children.length - 1].seqNum != currentParent.seqNum) {
                indentEl = document.createElement("IMG");
                indentEl.src = "Images/Dash.png";
            } else {
                indentEl = document.createElement("SPAN");
            }
            indentEl.classList.add("indent");
            dialine.prepend(indentEl);

            currentParent = currentParent.parent;
        }
    }
    let baseLeft = indent * 22;
    if(indent == 0) { //denotes root
        diatext.classList.add('root');
        diatext.innerText = 'Root';
    } else {
        dialine.appendChild(connector);
        dialine.appendChild(document.createElement("BR"));
        dialine.appendChild(expandButton);
        dialine.appendChild(document.createElement("BR"));
        dialine.appendChild(indicator);
        dialine.appendChild(document.createElement("BR"));
        if(seqNumVisible) {
            dialine.appendChild(seqNumIndicator);
            dialine.appendChild(document.createElement("BR"));
            diatext.style.top = dia.link ? "-140px" : "-128px";
        }
        diatext.style.left = (baseLeft + 65) + 'px';
        expandButton.style.left = (baseLeft + 17) + 'px';
        indicator.style.left = (baseLeft + 41) + 'px';
        connector.style.left = (baseLeft);
        dialine.style.width = baseLeft;
    }
    if(dia.link) {
        diatext.classList.add("link");
        let linkIco = document.createElement("IMG");
        linkIco.src = "Images/RedstoneDust.png";
        linkIco.classList.add("indicator");
        linkIco.classList.add("link");
        linkIco.addEventListener("click", function(event) { TransferClickToText(event); });
        linkIco.style.left = (baseLeft + 60) + 'px';
        if(seqNumVisible)
            linkIco.style.top = "-122px";
        diatext.style.left = (baseLeft + 80) + 'px';
        dialine.appendChild(linkIco);
        dialine.appendChild(document.createElement("BR"));
    }
    dialine.appendChild(diatext);
    connector.classList.add("connector");
    if(dia.parent == undefined || dia.parent.children[dia.parent.children.length - 1].seqNum == dia.seqNum) {
        connector.innerText = bracketE;
    } else {
        connector.innerText = bracketM;
    }
    diatext.classList.add("text");
    diatext.setAttribute("seq", dia.seqNum);
    diatext.setAttribute("link", dia.link);
    
    // vv Strict Ordering vv //
    diatext.addEventListener("click", function(event) {ClickLine(event)});
    if(dia.link)
        diatext.addEventListener("click", function() {DoubleClickDetector()});
    // ^^ Strict Ordering ^^ //

    diatext.addEventListener("mousedown", function(event) {ActivateDrag(event)});
    diatext.addEventListener("mouseover", function(event) {DropZone(event)});

    document.getElementById("main-window").appendChild(dialine);

    if(!diatext.classList.contains('root')) {
        const outputElements = HandleTellrawParseErrors(TellrawToHTML(dia.tellraw, alertLvl.all));
        outputElements.forEach((el) => {
            diatext.appendChild(el);
        });
        HandleMainWindowTellrawParseError(outputElements, dia.tellraw, diatext);
    }

    if(!dia.collapsed) {
        dia.children.forEach(async (el) => {
            RenderDialogue(el, indent);
        });
    }
}

function RefreshMainWindow(dragSideEffect = false) {
    document.getElementById("main-window").innerHTML = '';
    let tempSelected = selected;
    RenderDialogue(dialogue);
    if(!selected || isDeleted(selected.seqNum)) {
        Select(document.querySelector("#main-window span.root"));
    } else {
        Select(FindBySeqNumElement(selected.seqNum));
    }
    // if(!dragSideEffect && (!tempSelected || isHidden(tempSelected))) {
    //     //document.getElementById("main-window").lastChild.lastChild.click();
    // } else {
    //     document.querySelector('span.text[seq="' + tempSelected.seqNum + '"][link="' + tempSelected.link + '"]').click();
    // }
}

function DocClick(event) {
    try {
        if(event.target.id == "main-window" || event.target.parentElement.id == "main-window") {
            document.querySelectorAll("p > span.text").forEach(async (element) => {
                UnstyleElementSelected(element);
                Deselect();
            });
        }
    } catch(e) {
        //ignore errors for collapsing functionality
    }
}

//the responsibilitiies of select are complete; i.e. the front-end and the back-end will change their "selection states"
//you may not need a full resfresh for certain operations
function Select(element) {
    if(selected && isDeleted(selected.seqNum))
        selected = undefined;
    if(selected) {
        if(selected.link) {
            FindBySeqNumElement(selected.seqNum, true).forEach((el) => {
                UnstyleElementSelected(el);
            });
        } else {
            UnstyleElementSelected(FindBySeqNumElement(selected.seqNum));
        }
    }
    selected = FindBySeqNum(dialogue, element.getAttribute("seq"), element.getAttribute("link"));
    selectedElement = element;
    selectedElement.scrollIntoViewIfNeeded();

    if(element.classList.contains("root")) {
        //outputBox.classList.add("disabled");
        document.getElementById("input").setAttribute("disabled", "");
        document.getElementById("auto-checkbox").setAttribute("disabled", "");
        document.querySelectorAll(".submit-related").forEach((el) => { el.classList.add("disabled") });
        outputBox.innerText = "ROOT";
        document.getElementById("input").value = "ROOT";
    } else {
        document.getElementById("input").removeAttribute("disabled");
        document.getElementById("submit-line").removeAttribute("disabled");
        document.getElementById("submit-line").parentElement.classList.remove("disabled");
        document.getElementById("auto-checkbox").removeAttribute("disabled");
        document.querySelectorAll(".submit-related").forEach((el) => { el.classList.remove("disabled") });
        try {
            outputBox.classList.remove("disabled");
        } catch(e) {
            //first run fails since outputBox needs to be defined
        }
        document.getElementById("input").value = selected.tellraw;
    }
    if(selected.link) {
        let linkParent = FindBySeqNumElement(selected.link);
        if(linkParent)
            linkParent.classList.add("link-highlight");
    } else {
        document.querySelectorAll("span.text.link-highlight").forEach((element) => {
            element.classList.remove("link-highlight");
        });
        FindAllLinkedElements(selected.seqNum).forEach((element) => {
            element.classList.add("link-highlight");
        })
    }
    StyleElementSelected(element);
    RefreshActionList();
    RefreshConditionList();
}

function Deselect() {
    selected = undefined;
    selectedElement = undefined;
    document.getElementById("input").setAttribute("disabled", "");
    document.getElementById("submit-line").setAttribute("disabled", "");
    document.getElementById("submit-line").parentElement.classList.add("disabled");
    try {
        //outputBox.classList.add("disabled");
    } catch(e) {
        //first run fails since outputBox needs to be defined
    }
    RefreshActionList();
    RefreshConditionList();
}

function TargetSelectorChange(event) {
    if(event.target.value == "Custom") {
        document.getElementById("custom-tsi").style.display = "inline-block";
    } else {
        document.getElementById("custom-tsi").style.display = "none";
    }
}

function ClickLine(event) {
    if(!event.target.parentElement) return;
    let element = event.target;
    if(event.target.parentElement.tagName != "P") {
        element = event.target.parentElement;
    }
    
    Select(element);
}

function StyleElementSelected(element) {
    element.style.border = "1px dashed white";
    element.style.backgroundColor = "rgba(0, 0, 255, 0.5)";
    element.style.margin = "0px";
}

function UnstyleElementSelected(element) {
    element.style.border = "none";
    element.style.backgroundColor = "rgba(0, 0, 0, 0)";
    element.style.margin = "1px";
    document.querySelectorAll("span.text.link-highlight").forEach((element) => {
        element.classList.remove("link-highlight");
    });
}

function HandleTellrawParseErrors(parsedObjectOrErrors) {
    if(!parsedObjectOrErrors || parsedObjectOrErrors.length == 0) {
        return [];
    }
    if(parsedObjectOrErrors[0].toString() === parsedObjectOrErrors[0]) {
        document.querySelector("#tellraw-parse-errors-wrapper").style.display = "block";
        document.querySelector("#tellraw-parse-errors").innerHTML = ''; //remove all children
        parsedObjectOrErrors.forEach((errorMsg) => {
            const child = document.createElement("P");
            child.innerText = errorMsg;
            child.style.color = "inherit";
            document.querySelector("#tellraw-parse-errors").appendChild(child);
        });
        return [];
    }
    document.querySelector("#tellraw-parse-errors-wrapper").style.display = "none";
    return parsedObjectOrErrors; //now we know it is successful
}

function HandleMainWindowTellrawParseError(outputElements, badTellraw, diatext) {
    if(outputElements.length == 0) {
        diatext.innerHTML = '';
        const errorChild = document.createElement("SPAN");
        const badSpan = document.createElement("SPAN");
        badSpan.style.color = "red";
        badSpan.innerText = badTellraw;
        errorChild.innerText = "Could not parse: ";
        errorChild.title = "Check the error messages below";
        diatext.appendChild(errorChild);
        diatext.appendChild(badSpan);
        return false;
    }
    return true;
}

function SubmitLine(userActivated = false, alertLevel = alertLvl.all) {
    selected.tellraw = document.getElementById("input").value;
    var newOutput = HandleTellrawParseErrors(TellrawToHTML(selected.tellraw, alertLevel)).map((element) => {
        return element.outerHTML;
    }).join("");

    if(!HandleMainWindowTellrawParseError(newOutput, selected.tellraw, FindBySeqNumElement(selected.seqNum)))
        return;

    if(selected.link) {
        //update link parent
        FindBySeqNum(dialogue, selected.link).tellraw = newTellraw;
        let linkedElement = FindBySeqNumElement(selected.link);
        if(linkedElement)
            linkedElement.innerHTML = newOutput;
        //update link siblings
        FindAllLinkedElements(selected.link).forEach((element) => {
            element.innerHTML = newOutput;
        });
        //must update tellraw seperately in case things are collapsed
        FindAllLinkedDialogues(dialogue, selected.link).forEach((element) => {
            element.tellraw = newTellraw;
        });
    } else {
        //the element may be the parent of links
        FindAllLinkedElements(selected.seqNum).forEach((element) => {
            element.innerHTML = newOutput;
        });
        FindAllLinkedDialogues(dialogue, selected.seqNum).forEach((element) => {
            element.tellraw = newTellraw;
        });
    }
    selectedElement.innerHTML = newOutput;
    outputBox.classList.remove("disabled");
    if(userActivated) { //there are many scenarios where the system itself needs to submit a line using this function
        outputBox.innerHTML = newOutput;
        updateUndoList();
    }
}

function SetOutdated() {
    //outputBox.classList.add("disabled");
}

function TransferClickToText(event) {
    event.target.parentElement.lastChild.click();
}

function ToggleCollapse(event, dia) {
    dia.collapsed = !dia.collapsed;
    RefreshMainWindow();
}

function ResizeWidthFormatting() {
    let newMaxWidth = 1800 + (window.innerWidth - 1920);
    calculatedWidth = newMaxWidth;
    console.log(newMaxWidth);
    document.getElementById("main-window").style.maxWidth = newMaxWidth;
}

var seqNumVisible = false;
function ToggleSeqNum() {
    seqNumVisible = !seqNumVisible;
    RefreshMainWindow();
}

var expandables = {
    "action": false,
    "conditional": false
};
function ExpandExpandable(event) {
    let id = event.target.parentElement.id;
    expandables[id] = !expandables[id];

    document.querySelector("#" + id + ".expandable button").innerHTML = expandables[id] ? "-" : "+";
    if(expandables[id]) {
        document.querySelector(".expandable-content." + id).style.display = "block";
    } else {
        document.querySelector(".expandable-content." + id).style.display = "none";
    }
}

function TransferClickToFirstChild(event) {
    try {
        event.target.children[0].click();
    } catch(e) {
        //ignore false errors
    }
}

var doubleClicker = 0;

// assumes that event.target is a link child
function DoubleClickDetector() {
    doubleClicker++;
    if(doubleClicker < 2) {
        setTimeout(() => {
            DoubleClickTimeout();
        }, 500);
    }
    if(doubleClicker >= 2) {
        window.getSelection().removeAllRanges();
        doubleClicker = 0;
        let tempSelected = selected;
        isHidden(FindBySeqNum(dialogue, selected.link), true);
        let linkParent = FindBySeqNumElement(tempSelected.link);
        Select(linkParent);
    }
}

function DoubleClickTimeout() {
    doubleClicker = 0;
}