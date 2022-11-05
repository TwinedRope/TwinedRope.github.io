var sequenceNum = 0;

class DialogueObject {
    constructor(tellraw, children = [], parent = undefined, NPC, link, collapsed = false, seqNum = false, updateSeqNum = true) {
        this.tellraw = tellraw;
        this.children = children;
        this.parent = parent;
        if(seqNum || seqNum === 0) {
            this.seqNum = seqNum;
        } else {
            this.seqNum = sequenceNum;
        }
        this.NPC = NPC;
        this.link = link;
        this.collapsed = false;
        this.actions = [];
        this.conditions = {
            scores: [],
            random: [],
            custom: []
        };
        if(updateSeqNum)
            sequenceNum++;
    }
}

//Top-down recursion to find which dialogue object we clicked on
//Possible room for performance improvements...
function FindBySeqNum(dia, seq, link = false) {
    if(dia.seqNum == seq && dia.link.toString() == link.toString()) {
        return dia;
    } else {
        for(var i = 0; i < dia.children.length; i++) {
            let result = FindBySeqNum(dia.children[i], seq, link);
            if(result != undefined) {
                return result;
            }
        }
    }
}

function FindBySeqNumElement(seq, all = false) {
    let texts = document.querySelectorAll("#main-window p span.text");
    let elements = [];
    for(var i = 0; i < texts.length; i++) {
        if(texts[i].getAttribute("seq") == seq && (all || (texts[i].getAttribute("link") != texts[i].getAttribute("seq")))) {
            if(!all)
                return texts[i];
            elements.push(texts[i]);
        }
    }
    return elements.length == 0 ? undefined : elements; //return undefined to maintain backwards compatibility
}

function FindAllLinkedElements(seq) {
    let texts = document.querySelectorAll("#main-window p span.text");
    let linkedElements = [];
    for(var i = 0; i < texts.length; i++) {
        if(texts[i].getAttribute("link") == seq) {
            linkedElements.push(texts[i]);
        }
    }
    return linkedElements;
}

function FindAllLinkedDialogues(dia, seq) {
    let result = [];
    if(dia.link == seq) {
        result.push(dia);
    }
    for(var i = 0; i < dia.children.length; i++) {
        FindAllLinkedDialogues(dia.children[i], seq).forEach(element => {
            result.push(element);
        });
    }
    return result;
}

//useful for copy/pasting and saving!
//The JSON has no parent field; see JSONToDia for parent fields added back
function DiaToJSON(dia) {
    let diaJSON = {};
    diaJSON.seqNum = dia.seqNum;
    diaJSON.tellraw = dia.tellraw;
    diaJSON.children = [];
    diaJSON.NPC = dia.NPC;
    diaJSON.link = dia.link;
    diaJSON.collapsed = dia.collapsed;
    diaJSON.conditions = {
        scores: dia.conditions.scores,
        random: dia.conditions.random,
        custom: dia.conditions.custom
    };
    diaJSON.actions = dia.actions;
    dia.children.forEach((child) => {
        diaJSON.children.push(DiaToJSON(child));
    });
    return diaJSON;
}

function JSONToDia(diaJSON, parent, dragSideEffect) {
    let diaChildren = [];
    let dia = new DialogueObject(diaJSON.tellraw, diaChildren, parent, diaJSON.NPC, diaJSON.link, diaJSON.collapsed, diaJSON.seqNum, !dragSideEffect);
    dia.conditions.scores = diaJSON.conditions.scores;
    dia.conditions.random = diaJSON.conditions.random;
    dia.conditions.custom = diaJSON.conditions.custom;
    dia.actions = diaJSON.actions;
    diaJSON.children.forEach((child) => {
        diaChildren.push(JSONToDia(child, dia));
    });
    return dia;
}

function isChild(parent, childQuery) {
    if(childQuery.seqNum == 0) {
        return false;
    }
    let child = childQuery;
    while(child.parent.seqNum != 0) {
        if(child.parent.seqNum == parent.seqNum && child.parent.link.toString() == parent.link.toString()) {
            return true;
        }
        child = child.parent;
    }
    return false;
}

//hidden via a collapsed parent; the expand parameter REQUIRES a RefreshMainWindow() call
function isHidden(dia, expand = false) {
    if(!document.querySelector('span.text[seq="' + dia.seqNum + '"]')) {
        if(expand) dia.collapsed = false;
        return true;
    }
    if(dia.seqNum == 0 || dia.parent.seqNum == 0) {
        return false;
    }
    let curr = dia;
    while(curr.parent) {
        if(curr.parent.collapsed == true) {
            if(expand) curr.parent.collapsed = false;
            return true;
        }
        curr = curr.parent;
    }
    return false;
}

function isDeleted(seqNum) {
    if(seqNum == 0)
        return false;
    if(document.querySelector('span.text[seq="' + seqNum + '"]'))
        return false;
    return true;
}