const bracketE = '˪';
const bracketM = '˫';
const bracketV = '|';

var calculatedWidth = '1500px';

var clicks = 0;
var selected;
var selectedElement;

var dialogue = new DialogueObject('ROOT', [], undefined, false, false);

function DialogueInit() {
    Initialize();

    document.body.addEventListener("mouseup", function() {DeactivateDrag()});
    document.body.addEventListener("mousemove", function(event) {Drag(event)});

    RefreshMainWindow();

    let element = document.querySelector(".text");
    element.style.border = "1px dashed white";
    element.style.backgroundColor = "rgba(0, 0, 255, 0.5)";
    element.style.margin = "0px";
    Select(element);
}

//NOTE: Recursive
function RenderDialogue(dia, indent = 0) {
    let dialine = document.createElement("P");
    let connector = document.createElement("SPAN");
    let diatext = document.createElement("SPAN");
    let indicator = document.createElement("IMG");
    let expandButton = document.createElement("BUTTON");
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
            if(currentParent.parent != undefined && currentParent.parent.children[currentParent.parent.children.length - 1] != currentParent) {
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
    } else {
        dialine.appendChild(connector);
        dialine.appendChild(expandButton);
        dialine.appendChild(indicator);
        diatext.style.left = (baseLeft + 65) + 'px';
        expandButton.style.left = (baseLeft + 17) + 'px';
        indicator.style.left = (baseLeft + 41) + 'px';
        connector.style.left = (baseLeft);
        dialine.style.width = baseLeft;
        expandButton.style.marginRight = calculatedWidth;
        indicator.style.marginRight = calculatedWidth;
        connector.style.marginRight = calculatedWidth;
    }
    if(dia.link) {
        diatext.classList.add("link");
        let linkIco = document.createElement("IMG");
        linkIco.src = "Images/RedstoneDust.png";
        linkIco.classList.add("indicator");
        linkIco.classList.add("link");
        linkIco.addEventListener("click", function(event) { TransferClickToText(event); });
        linkIco.style.left = (baseLeft + 60) + 'px';
        diatext.style.left = (baseLeft + 80) + 'px';
        linkIco.style.marginRight = calculatedWidth;
        diatext.style.marginRight = calculatedWidth;
        dialine.appendChild(linkIco);
    }
    dialine.appendChild(diatext);
    connector.classList.add("connector");
    if(dia.parent == undefined || dia.parent.children[dia.parent.children.length - 1] == dia) {
        connector.innerText = bracketE;
    } else {
        connector.innerText = bracketM;
    }
    diatext.classList.add("text");
    diatext.setAttribute("seq", dia.seqNum);
    diatext.setAttribute("link", dia.link);
    diatext.addEventListener("click", function(event) {ClickLine(event)});
    diatext.addEventListener("mousedown", function(event) {ActivateDrag(event)});
    diatext.addEventListener("mouseover", function(event) {DropZone(event)});

    document.getElementById("main-window").appendChild(dialine);

    Select(document.getElementById("main-window").lastChild.lastChild);

    if(!dia.collapsed) {
        dia.children.forEach((el) => {
            RenderDialogue(el, indent);
        });
    }
}

function RefreshMainWindow() {
    document.getElementById("main-window").innerHTML = '';
    RenderDialogue(dialogue);
}

function DocClick(event) {
    if(event.target.id != "input" && event.target.innerText != "Submit" && event.target.tagName != 'BUTTON' && event.target.parentElement.tagName != "BUTTON") {
        document.querySelectorAll("p > span.text").forEach((element) => {
            element.style.border = "none";
            element.style.backgroundColor = "rgba(0, 0, 0, 0)";
            element.style.margin = "1px";
            Deselect();
        });
    }
}

function Select(element) {
    selected = FindBySeqNum(dialogue, element.getAttribute("seq"));
    selectedElement = element;
    if(!element.classList.contains("root")) {
        document.getElementById("input").removeAttribute("disabled");
        document.getElementById("submit-line").removeAttribute("disabled");
        document.getElementById("submit-line").parentElement.classList.remove("disabled");
        try {
            outputBox.classList.remove("disabled");
        } catch(e) {
            //first run fails since outputBox needs to be defined
        }
        document.getElementById("input").value = selected.tellraw;
        SubmitLine();
    } else {
        element.innerText = "Root";
        outputBox.classList.add("disabled");
        document.getElementById("input").setAttribute("disabled", "");
        outputBox.innerText = "ROOT";
        document.getElementById("input").value = "ROOT";
    }

    if(selected.link) {
        let linkParent = FindBySeqNumElement(selected.link);
        if(linkParent)
            linkParent.classList.add("link-highlight");
    } else {
        document.querySelectorAll("span.text.link-highlight").forEach((element) => {
            element.classList.remove("link-highlight");
        });
    }
}

function Deselect() {
    selected = undefined;
    selectedElement = undefined;
    document.getElementById("input").setAttribute("disabled", "");
    document.getElementById("submit-line").setAttribute("disabled", "");
    document.getElementById("submit-line").parentElement.classList.add("disabled");
    document.querySelectorAll("span.text.link-highlight").forEach((element) => {
        element.classList.remove("link-highlight");
    });
    try {
        outputBox.classList.add("disabled");
    } catch(e) {
        //first run fails since outputBox needs to be defined
    }
}

function TargetSelectorChange(event) {
    if(event.target.value == "Custom") {
        document.getElementById("custom-tsi").style.display = "inline-block";
    } else {
        document.getElementById("custom-tsi").style.display = "none";
    }
}

function ClickLine(event) {
    let element = event.target;
    if(event.target.parentElement.tagName != "P") {
        element = event.target.parentElement;
    }
    setTimeout(() => {
        element.style.border = "1px dashed white";
        element.style.backgroundColor = "rgba(0, 0, 255, 0.5)";
        element.style.margin = "0px";
        Select(element);
    }, 1);
}

function SubmitLine() {
    try {
        ImportTellrawCode(true);
    } catch(e) {
        alert("The tellraw you entered could not be parsed. Consider submitting a bug report if this seems wrong.");
        return;
    }
    let newTellraw = document.getElementById("input").value;
    let newOutput = "";
    outputBox.childNodes.forEach((element) => {
        if(element.tagName != "BR") {
            newOutput += element.outerHTML;
        }
    });
    selected.tellraw = newTellraw;

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
}

function SetOutdated() {
    outputBox.classList.add("disabled");
}

function TransferClickToText(event) {
    event.target.parentElement.lastChild.click();
}

function ToggleCollapse(event, dia) {
    dia.collapsed = !dia.collapsed;
    RefreshMainWindow();
}