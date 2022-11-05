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
    return new Promise(async (resolve, reject) => {
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
        selected = selected.children[0];
        RefreshMainWindow();
        let newElement = FindBySeqNumElement(selected.seqNum);
        Select(newElement);
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

function DCopy(cut = false) {
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
    }).then(() => {
        if(cut)
            DDeleteRecursive();
    });
    copied = true;
    copiedSeqNum = selected.seqNum;
}

function DPaste(aslink = false, dragSideEffect = false) {
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
                navigator.clipboard.readText().then(async (data) => {
                    let pasteDia = JSONToDia(JSON.parse(data), mySelected, (dragSideEffect || isDeleted(copiedSeqNum)));
                    if(aslink && pasteDia.link) {
                        alert("Cannot paste a link as link. Use the regular paste button instead.");
                        reject();
                        return;
                    }
                    if(aslink && isDeleted(pasteDia.seqNum)) {
                        alert("Connot paste as link after cutting. Parent line no longer exists.");
                        reject();
                        return;
                    }
                    if(mySelected.link && (mySelected.NPC != pasteDia.NPC)) {
                        alert("You cannot paste a child dialogue line to a link. Add it to the parent dialogue of the link instead.");
                        reject();
                        return;
                    }
                    if(mySelected.seqNum == 0 && !pasteDia.NPC) {
                        alert("You cannot paste a player dialogue on the root node.");
                        reject();
                        return;
                    }
                    if(aslink && pasteDia.parent != undefined) {
                        let siblingFlag = false;
                        if(mySelected.NPC != pasteDia.NPC) {
                            mySelected.children.forEach((child) => {
                                if(child.seqNum == pasteDia.seqNum) {
                                    siblingFlag = true;
                                }
                            }); 
                        } else {
                            mySelected.parent.children.forEach((child) => {
                                if(child.seqNum == pasteDia.seqNum) {
                                    siblingFlag = true;
                                }
                            });
                        }
                        if(siblingFlag) {
                            alert("You cannot add a link as a sibling to the link's parent. Consider adding a new sibling, then linking to the original's next dialogue.");
                            reject();
                            return;
                        }
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
                    if(!aslink && !dragSideEffect && !isDeleted(pasteDia.seqNum)) {
                        //we need new sequence numbers for any objects that were copied and pasted; unless we dragged it or cut it
                        CreateNewSeqNums(pasteDia);
                    }
                    RefreshMainWindow();
                    //Deselect();
                    UnstyleElementSelected(mySelectedElement);
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
    if(dia.seqNum != 0)
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
    let saveSeqNum = selected.seqNum;
    let saveLink = selected.link;
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
    selected = FindBySeqNum(dialogue, saveSeqNum, saveLink);
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
    Object.assign(dialogue, dialogueHistory[undoIndex]);
    //dialogue = RecursiveDeepCopyDialogue(dialogueHistory[undoIndex]);
    //DeepCopyAddParentRefs(dialogue);
    console.log("Undid: " + undoIndex);
    RefreshMainWindow();
    UpdateUndoerButtonStates();
}

function Redo() {
    if(undoIndex >= dialogueHistory.length - 1)
        return;
    undoIndex++;
    Object.assign(dialogue, dialogueHistory[undoIndex]);
    // dialogue = RecursiveDeepCopyDialogue(dialogueHistory[undoIndex]);
    // DeepCopyAddParentRefs(dialogue);
    if(isDeleted(selected.seqNum))
        Select(document.querySelector("#main-window span.root"))
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

const KeyCodes = {
    shift: 16,
    ctrl: 17,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    c: 67,
    i: 73,
    s: 83,
    t: 84,
    v: 86,
    x: 88,
    y: 89,
    z: 90
}

var buttonStates = {
    shift: 0,
    ctrl: 0,
    left: 0,
    up: 0,
    right: 0,
    down: 0,
    insert: 0,
    delete: 0,
    c: 0,
    i: 0,
    s: 0,
    t: 0,
    v: 0,
    x: 0,
    y: 0,
    z: 0
}

function MapButtonsDown(event) {
    if(document.activeElement.id == "input") return;
    switch(event.keyCode) {
        case KeyCodes.shift:
            buttonStates.shift = 1;
        break;
        case KeyCodes.ctrl:
            buttonStates.ctrl = 1;
        break;
        case KeyCodes.left:
            if(selected.parent)
                FindBySeqNumElement(selected.parent.seqNum).click();
            buttonStates.left = 1;
        break;
        case KeyCodes.up:
            buttonStates.up = 1;
        break;
        case KeyCodes.right:
            if(selected.children.length > 0) {
                if(selected.collapsed) {
                    let seqNumTarget = selected.children[0].seqNum;
                    ToggleCollapse(undefined, selected);
                    Select(FindBySeqNumElement(seqNumTarget));
                } else {
                    Select(FindBySeqNumElement(selected.children[0].seqNum));
                }
            }
            buttonStates.right = 1;
        break;
        case KeyCodes.down:
            buttonStates.down = 1;
        break;
        case KeyCodes.insert:
            DAdd();
            buttonStates.insert = 1;
        break;
        case KeyCodes.delete:
            DDeleteRecursive();
            buttonStates.delete = 1;
        break;
        case KeyCodes.c:
            if(buttonStates.ctrl == 1) {
                DCopy();
            }
            buttonStates.c = 1;
        break;
        case KeyCodes.i:
            if(buttonStates.ctrl == 1) {
                document.querySelector("#json-import").click();
                ResetAfterAction();
            }
            buttonStates.i = 1;
        break;
        case KeyCodes.s:
            if(buttonStates.ctrl == 1) {
                document.querySelector("#save-project").click();
                ResetAfterAction();
            }
            buttonStates.s = 1;
        break;
        case KeyCodes.t:
            if(buttonStates.ctrl == 1) {
                document.querySelector("#seq-num-toggle").click();
            }
            buttonStates.t = 1;
        break;
        case KeyCodes.v:
            if(buttonStates.ctrl == 1) {
                if(buttonStates.shift == 1) {
                    DPaste(true, false, false);
                } else {
                    DPaste(false, false, false);
                }
            }
            buttonStates.v = 1;
        break;
        case KeyCodes.x:
            if(buttonStates.ctrl == 1) {
                DPaste(false, true, false);
            }
            buttonStates.x = 1;
        break;
        case KeyCodes.y:
            if(buttonStates.ctrl == 1) {
                Redo();
            }
            buttonStates.y = 1;
        break;
        case KeyCodes.z:
            if(buttonStates.ctrl == 1) {
                Undo();
            }
            buttonStates.z = 1;
        break;
    }
}

function MapButtonsUp(event, override = false) {
    var codeOfTheKey;
    if(override) {
        codeOfTheKey = override
    } else {
        codeOfTheKey = event.keyCode
    }
    switch(codeOfTheKey) {
        case KeyCodes.shift:
            buttonStates.shift = 0;
        break;
        case KeyCodes.ctrl:
            buttonStates.ctrl = 0;
        break;
        case KeyCodes.left:
            buttonStates.left = 0;
        break;
        case KeyCodes.up:
            buttonStates.up = 0;
        break;
        case KeyCodes.right:
            buttonStates.right = 0;
        break;
        case KeyCodes.down:
            buttonStates.down = 0;
        break;
        case KeyCodes.insert:
            buttonStates.insert = 0;
        break;
        case KeyCodes.delete:
            buttonStates.delete = 0;
        break;
        case KeyCodes.c:
            buttonStates.c = 0;
        break;
        case KeyCodes.i:
            buttonStates.i = 0;
        break;
        case KeyCodes.s:
            buttonStates.s = 0;
        break;
        case KeyCodes.t:
            buttonStates.t = 0;
        break;
        case KeyCodes.v:
            buttonStates.v = 0;
        break;
        case KeyCodes.x:
            buttonStates.x = 0;
        break;
        case KeyCodes.y:
            buttonStates.y = 0;
        break;
        case KeyCodes.z:
            buttonStates.z = 0;
        break;
    }
}

function ResetAfterAction(keysToReset = [KeyCodes.ctrl, KeyCodes.shift]) {
    keysToReset.forEach((key) => {
        MapButtonsUp(undefined, key);
    });
}
