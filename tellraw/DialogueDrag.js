var dragging = false;
function ActivateDrag(event) {
    if(event.target.classList.contains("root")) {
        return;
    }
    if(event.target.parentElement.tagName == "SPAN") {
        dragging = event.target.parentElement;
    } else {
        dragging = event.target;
    }
    window.getSelection().removeAllRanges();
}

function DeactivateDrag() {
    if(dropZone) {
        Drop(dropZone);
        dropZone = false;
    }
    dragging = false;
    dragTime = 0;
    document.getElementById("drag").style.display = 'none';
    document.body.style.cursor = 'unset';
    document.getElementById("main-window").style.cursor = "unset";
}

var mousePos = {};
var dragTime = 0;
function Drag(event) {
    if(dragging) {
        window.getSelection().removeAllRanges();
        dragTime++;
        if(dragTime > 10) {
            if(dragTime == 11) {
                selected = FindBySeqNum(dialogue, dragging.getAttribute("seq"), dragging.getAttribute("link"));
                selectedElement = dragging;
                selectedElement.scrollIntoViewIfNeeded();
                DCopy();
            }
            mousePos = {
                x: event.clientX,
                y: event.clientY
            };
            let dragEl = document.getElementById("drag");
            dragEl.style.display = "block";
            dragEl.style.left = mousePos.x + 10;
            dragEl.style.top = mousePos.y + 10;
            dragEl.innerHTML = dragging.innerHTML;
            document.body.style.cursor = "not-allowed";
            document.getElementById("main-window").style.cursor = "move";
        }
    }
}

var dropZone = false;
function DropZone(event) {
    if(dragging) {
        if(event.target.parentElement.tagName == "SPAN") {
            dropZone = event.target.parentElement;
        } else {
            dropZone = event.target;
        }
    }
}

var dropError = false;
function Drop(element) {
    if(dragging) {
        let oldSelected = selected;
        let oldSelectedElement = selectedElement;
        //element.click();
        selected = FindBySeqNum(dialogue, element.getAttribute("seq"), element.getAttribute("link"));
        selectedElement = element;
        if(!isChild(oldSelected, selected)) {
            DPaste(false, true, true).then(() => {
                selected = oldSelected;
                selectedElement = oldSelectedElement;
                DDeleteRecursive(true);
                updateUndoList(); //we have "supressed" the updates from the original paste and delete to make it explicit here, and only when the drag succeeds
            }).catch(() => {
                return; //ignore errors - error handling found in paste function
            });
        } else {
            alert("You cannot drag a dialogue line to one of its children.");
        }
        selectedElement.scrollIntoViewIfNeeded();
    }
}