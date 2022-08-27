function DAdd() {
    DAddPromise().then(() => {
        UnlockButtons();
    }).catch(() => {
        alert("Please select a dialogue line as the parent to add to.");
        UnlockButtons();
    });
}

function DAddPromise() {
    return new Promise((resolve, reject) => {
        DisableButtons();
        if(selected == undefined) {
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
        resolve();
    });
}

function DDeleteRecursive() {
    if(selected == undefined) {
        alert("Please select a dialogue line to delete.");
        return;
    }
    if(selected.parent == undefined) {
        alert("Cannot delete root node. If you are trying to start over, refresh this page.");
        return;
    }
    selected.parent.children.splice(selected.parent.children.indexOf(selected), 1);
    
    RefreshMainWindow();
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

function DPaste(aslink = false, cut = false) {
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
                    RefreshMainWindow();
                    Deselect();
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