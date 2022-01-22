function AddAction() {
    if(selected) {
        if(document.getElementById("action-text-area").value.length > 0) {
            selected.actions.push(document.getElementById("action-text-area").value);
            RefreshActionList();
        } else {
            alert("Please enter an action to add to this line.");
        }
    } else {
        alert("Select a line to add this action to first.");
    }
}

function RefreshActionList() {
    document.querySelector(".action .list").innerHTML = "";
    document.querySelector(".action p").style.display = "none";
    document.querySelector(".action .list").style.display = "none";

    if(selected) {
        for(var i = 0; i < selected.actions.length; i++) {
            CreateActionItem(selected.actions[i], i);
        }

        if(selected.actions.length > 0) {
            document.querySelector(".action p").style.display = "block";
            document.querySelector(".action .list").style.display = "block";
        }
    }
}

function CreateActionItem(str, i) {
    let actWrap = document.createElement("DIV");
    let actXDiv = document.createElement("DIV");
    let actXButton = document.createElement("BUTTON");
    let actText = document.createElement("P");
    actText.classList.add("action-text");
    actText.innerText = str;
    actXDiv.classList.add("action-x");
    actXDiv.classList.add("button");
    actXDiv.title = "remove action " + str.substr(0, 50);
    actXButton.innerText = "x";
    actXButton.onclick = (event) => { RemoveAction(event) };
    actXDiv.appendChild(actXButton);
    actWrap.appendChild(actXDiv);
    actWrap.appendChild(actText);
    actWrap.setAttribute("index", i);
    document.querySelector(".action .list").appendChild(actWrap);
}

function RemoveAction(event) {
    let mainElement = event.target.parentElement.parentElement;
    selected.actions.splice(mainElement.getAttribute("index"), 1);
    RefreshActionList();
}

var ifunless = "if";
function ToggleIfUnless(event) {
    if(event.target.innerText == "if") {
        event.target.innerText = "unless";
        ifunless = "unless";
    } else {
        event.target.innerText = "if";
        ifunless = "if";
    }
}

function AddCustomCondition(event) {
    if(selected) {
        if(document.getElementById("condition-custom").value.length > 0)  {
            selected.conditions.custom.push(ifunless + " " + document.getElementById("condition-custom").value);
            RefreshConditionList();
        } else {
            alert("Please enter a custom condition to add to this dialogue line.");
        }

    } else {
        alert("Please select the dialogue line to add the condition to.");
    }
}

function AddRandomCondition(event) {
    if(selected) {
        if(document.getElementById("condition-random").value.length > 0) {
            var perc = parseFloat(document.getElementById("condition-random").value);
            if(perc) {
                selected.conditions.random.push(perc + "% chance");
                RefreshConditionList();
            } else {
                alert("Please enter a valid integer or floating point number in the percentage field.")
            }
        } else {
            alert("Please enter a value in the percentage field")
        }
    } else {
        alert("Please select the dialogue line to add the condition to.");
    }
}

function AddScoreCondition(event) {
    if(selected) {
        var against = parseInt(document.getElementById("condition-against").value);
        if(document.getElementById("condition-scoreboard").value.length > 0 && document.getElementById("condition-against").value.length > 0 && (against || against == 0)) {
            selected.conditions.scores.push("if " + document.getElementById("condition-scoreboard").value + " " + document.getElementById("condition").value + " " + against);
            RefreshConditionList();
        } else {
            alert("Please enter a scoreboard name and a number to compare against.")
        }
    } else {
        alert("Please select the dialogue line to add the condition to.");
    }
}

function RefreshConditionList() {
    document.querySelector(".conditional .list .score").innerHTML = "";
    document.querySelector(".conditional .list .random").innerHTML = "";
    document.querySelector(".conditional .list .custom").innerHTML = "";
    
    document.querySelector(".conditional p").style.display = "none";
    document.querySelector(".conditional .list").style.display = "none";
    document.querySelector(".conditional .list .custom").style.display = "none";
    document.querySelector(".conditional .list .score").style.display = "none";
    document.querySelector(".conditional .list .random").style.display = "none";
    document.querySelector(".conditional .list p.custom-ll").style.display = "none";
    document.querySelector(".conditional .list p.score-ll").style.display = "none";
    document.querySelector(".conditional .list p.random-ll").style.display = "none";

    if(selected) {
        for(var i = 0; i < selected.conditions.scores.length; i++) {
            CreateConditionalItem(".conditional .list .score", selected.conditions.scores[i], i);
        }
        for(var j = 0; j < selected.conditions.random.length; j++) {
            CreateConditionalItem(".conditional .list .random", selected.conditions.random[j], j);
        }
        for(var k = 0; k < selected.conditions.custom.length; k++) {
            CreateConditionalItem(".conditional .list .custom", selected.conditions.custom[k], k);
        }

        if(selected.conditions.custom.length > 0) {
            document.querySelector(".conditional p").style.display = "block";
            document.querySelector(".conditional .list").style.display = "block";
            document.querySelector(".conditional .list .custom").style.display = "block";
            document.querySelector(".conditional .list p.custom-ll").style.display = "block";
        }
        if(selected.conditions.scores.length > 0) {
            document.querySelector(".conditional p").style.display = "block";
            document.querySelector(".conditional .list").style.display = "block";
            document.querySelector(".conditional .list .score").style.display = "block";
            document.querySelector(".conditional .list p.score-ll").style.display = "block";
        }
        if(selected.conditions.random.length > 0) {
            document.querySelector(".conditional p").style.display = "block";
            document.querySelector(".conditional .list").style.display = "block";
            document.querySelector(".conditional .list .random").style.display = "block";
            document.querySelector(".conditional .list p.random-ll").style.display = "block";
        }
    }
}

function CreateConditionalItem(addQuery, value, i) {
    let condWrap = document.createElement("DIV");
    let condXDiv = document.createElement("DIV");
    let condXButton = document.createElement("BUTTON");
    let condText = document.createElement("P");
    condText.classList.add("action-text");
    condText.innerText = value;
    condXDiv.classList.add("action-x");
    condXDiv.classList.add("button");
    condXDiv.title = "remove action " + value.substr(0, 50);
    condXButton.innerText = "x";
    condXButton.onclick = (event) => { RemoveCondition(event, addQuery) };
    condXDiv.appendChild(condXButton);
    condWrap.appendChild(condXDiv);
    condWrap.appendChild(condText);
    condWrap.setAttribute("index", i);
    document.querySelector(addQuery).appendChild(condWrap);
}

function RemoveCondition(event, addQuery) {
    let mainElement = event.target.parentElement.parentElement;
    if(addQuery.indexOf("score") != -1) {
        selected.conditions.scores.splice(mainElement.getAttribute("index"), 1);
    } else if(addQuery.indexOf("random") != -1) {
        selected.conditions.random.splice(mainElement.getAttribute("index"), 1);
    } else if(addQuery.indexOf("custom") != -1) {
        selected.conditions.custom.splice(mainElement.getAttribute("index"), 1);
    }
    RefreshConditionList();
}