var dialogueHistory = [dialogue = new DialogueObject('ROOT', [], undefined, false, false, false, 0, false)];
var undoIndex = 0;

function DAdd() {
    DAddPromise().then(() => {
        UnlockButtons();
    }).catch(() => {
        UnlockButtons();
    });
}

function DAddPromise() {
    return new Promise((resolve, reject) => {
        DisableButtons();
        if(selected == undefined) {
            alert("Please select a dialogue line as the parent to add to.");
            reject();
        } else if(selected.link) {
            alert("You cannot add a child dialogue line to a link. Add it to the parent dialogue line instead.");
            reject();
        } else {
            if(selected.collapsed) {
                selected.collapsed = false;
            }
            let addition = new DialogueObject('/tellraw @p {"text":"","extra":[{"text":"__"}]}', [], selected, !selected.NPC, false);
            selected.children.splice(0, 0, addition);
        }
        RefreshMainWindow();
    
        //select the newly added element automatically
        let allText = document.querySelectorAll("#main-window p.line span.text");
        let newElement;
        for(var i = 0; i < allText.length; i++) {
            if(allText[i].getAttribute("seq") == sequenceNum - 1) {
                newElement = allText[i];
                break;
            }
        }
        Select(newElement);
        RefreshMainWindow();
        updateUndoList();
        resolve();
    });
}

function DDeleteRecursive(dragSideEffect = false) {
    if(selected == undefined) {
        alert("Please select a dialogue line to delete.");
        return;
    }
    if(selected.parent == undefined) {
        alert("Cannot delete root node. If you are trying to start over, refresh this page.");
        return;
    }
    selected.parent.children.splice(selected.parent.children.indexOf(selected), 1);
    
    if(!dragSideEffect)
        updateUndoList();
    RefreshMainWindow(dragSideEffect);
}

var copied = false;
var copiedSeqNum;

function DCopy() {
    if(selected == undefined) {
        alert("Please select a dialogue line to copy.");
        return;
    }
    if(selected.parent == undefined) {
        alert("Cannot copy root node. Multiple dialogues for 1 NPC can be achieved by creating multiple children on the root node.");
        return;
    }
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
        if(result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(JSON.stringify(DiaToJSON(selected)));
        } else {
            alert("Your browser does not allow websites (such as this one) to access your clipboard. Please allow this to use the paste feature.");
        }
    });
    copied = true;
    copiedSeqNum = selected.seqNum;
}

function DPaste(aslink = false, cut = false, dragSideEffect = false) {
    var mySelected = selected;
    var mySelectedElement = selectedElement;
    return new Promise((resolve, reject) => {
        if(!copied) {
            alert("You have nothing currently copied.");
            reject();
            return;
        }
        if(mySelected == undefined) {
            alert("Please select a dialogue line to paste into.");
            reject();
            return;
        }
        navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.readText().then((data) => {
                    let pasteDia = JSONToDia(JSON.parse(data), mySelected);
                    if(aslink && pasteDia.link) {
                        alert("Cannot paste a link as link. Use the regular paste button instead.");
                        reject();
                        return;
                    }
                    if(mySelected.link && (mySelected.NPC != pasteDia.NPC)) {
                        alert("You cannot add a child dialogue line to a link. Add it to the parent dialogue line instead.");
                        reject();
                        return;
                    }
                    if(pasteDia.NPC == mySelected.NPC) {
                        if(mySelected.parent) {
                            pasteDia.parent = mySelected.parent;
                            mySelected.parent.children.splice(0, 0, pasteDia);
                        } else {
                            alert("Cannot paste player response as the child of the Root node.");
                            reject();
                            return;
                        }
                    } else {
                        if(mySelected.collapsed) {
                            mySelected.collapsed = false;
                        }
                        pasteDia.parent = mySelected;
                        mySelected.children.push(pasteDia);
                    }
                    if(aslink) {
                        pasteDia.children = []; //required for "link"s
                        pasteDia.link = copiedSeqNum;
                    }
                    if(cut) {
                        pasteDia.seqNum = copiedSeqNum;
                    }
                    if(!cut && !aslink) {
                        //we need new sequence numbers for any objects that were copied and pasted
                        CreateNewSeqNums(pasteDia);
                    }
                    RefreshMainWindow();
                    Deselect();
                    if(!dragSideEffect)
                        updateUndoList();
                    resolve();
                });
            } else {
                alert("Your browser does not allow websites (such as this one) to access your clipboard. Please allow this to use the paste feature.");
            }
        });
    });
}

function CollapseExpandAll(collapsed) {
    CollapseExpandRecursion(collapsed, dialogue);
    RefreshMainWindow();
}

function CollapseExpandRecursion(collapsed, dia) {
    if(dia.tellraw != 'ROOT')
        dia.collapsed = collapsed;
    dia.children.forEach((child) => {
        CollapseExpandRecursion(collapsed, child);
    });
}

function DisableButtons() {
    document.querySelectorAll("table#side-btn-container button").forEach((el) => {
        el.setAttribute("disabled", "");
    });
}

function UnlockButtons() {
    document.querySelectorAll("table#side-btn-container button").forEach((el) => {
        el.removeAttribute("disabled");
    });
}

function CreateNewSeqNums(parent) {
    parent.seqNum = sequenceNum;
    sequenceNum++;
    parent.children.forEach((child) => {
        CreateNewSeqNums(child);
    });
}

//call this after every dialogue state change
function updateUndoList() {
    //requires a (recursive) deep copy of the current dialogue object
    if(dialogueHistory.length < 100) {
        undoIndex++;
        dialogueHistory.splice(undoIndex, 100, RecursiveDeepCopyDialogue(dialogue));
        DeepCopyAddParentRefs(dialogueHistory[undoIndex]);
    } else {
        undoIndex++;
        dialogueHistory.splice(0, 1);
        dialogueHistory.splice(undoIndex, 100, RecursiveDeepCopyDialogue(dialogue));
        DeepCopyAddParentRefs(dialogueHistory[undoIndex]);
    }
    UpdateUndoerButtonStates();
    console.log("Updated Undo List: " + undoIndex);
}

function RecursiveDeepCopyDialogue(dia) {
    let copiedChildList = [];
    dia.children.forEach((child) => {
        copiedChildList.push(RecursiveDeepCopyDialogue(child));
    });
    let deepCopy = new DialogueObject(dia.tellraw, copiedChildList, dia.parent, dia.NPC, dia.link, dia.collapsed, dia.seqNum, false);
    return deepCopy;
}

function DeepCopyAddParentRefs(parent) {
    parent.children.forEach((child) => {
        child.parent = parent;
        DeepCopyAddParentRefs(child);
    });
}

function Undo() {
    if(undoIndex <= 0)
        return;
    undoIndex--;
    dialogue = RecursiveDeepCopyDialogue(dialogueHistory[undoIndex]);
    DeepCopyAddParentRefs(dialogue);
    console.log("Undid: " + undoIndex);
    RefreshMainWindow();
    UpdateUndoerButtonStates();
}

function Redo() {
    if(undoIndex >= dialogueHistory.length - 1)
        return;
    undoIndex++;
    dialogue = RecursiveDeepCopyDialogue(dialogueHistory[undoIndex]);
    DeepCopyAddParentRefs(dialogue);
    console.log("Redid: " + undoIndex);
    RefreshMainWindow();
    UpdateUndoerButtonStates();
}

function DisableUndo() {
    document.querySelectorAll("div.button.undoers")[1].classList.add("disabled");
    document.querySelectorAll("div.button.undoers")[1].querySelectorAll("img")[0].classList.add("hidden");
    document.querySelectorAll("div.button.undoers")[1].querySelectorAll("img")[1].classList.remove("hidden");
    document.querySelectorAll("div.button.undoers button")[1].setAttribute("disabled", "");
}

function DisableRedo() {
    document.querySelectorAll("div.button.undoers")[0].classList.add("disabled");
    document.querySelectorAll("div.button.undoers")[0].querySelectorAll("img")[0].classList.add("hidden");
    document.querySelectorAll("div.button.undoers")[0].querySelectorAll("img")[1].classList.remove("hidden");
    document.querySelectorAll("div.button.undoers button")[0].setAttribute("disabled", "");
}

function EnableUndo() {
    document.querySelectorAll("div.button.undoers")[1].classList.remove("disabled");
    document.querySelectorAll("div.button.undoers")[1].querySelectorAll("img")[0].classList.remove("hidden");
    document.querySelectorAll("div.button.undoers")[1].querySelectorAll("img")[1].classList.add("hidden");
    document.querySelectorAll("div.button.undoers button")[1].removeAttribute("disabled");
}

function EnableRedo() {
    document.querySelectorAll("div.button.undoers")[0].classList.remove("disabled");
    document.querySelectorAll("div.button.undoers")[0].querySelectorAll("img")[0].classList.remove("hidden");
    document.querySelectorAll("div.button.undoers")[0].querySelectorAll("img")[1].classList.add("hidden");
    document.querySelectorAll("div.button.undoers button")[0].removeAttribute("disabled");
}

function UpdateUndoerButtonStates() {
    if(undoIndex < dialogueHistory.length - 1)
        EnableRedo();
    if(undoIndex > 0)
        EnableUndo();
    if(undoIndex >= dialogueHistory.length - 1)
        DisableRedo();
    if(undoIndex <= 0)
        DisableUndo();
}