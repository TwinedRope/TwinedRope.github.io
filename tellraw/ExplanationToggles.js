var expToggles = new Array();

function ToggleExp(id) {
    while(id >= expToggles.length) {
        expToggles.push(false);
    }
    
    if(expToggles[id]) {
        document.getElementById(id).style.display = 'none';
        event.target.innerHTML = 'show explanation';
        expToggles[id] = false;
    } else {
        document.getElementById(id).style.display = 'block';
        event.target.innerHTML = 'hide explanation';
        expToggles[id] = true;
    }
}

var showHideToggles = new Array();

function ShowHide(id, event) {
    while(id >= showHideToggles.length) {
        showHideToggles.push(true);
    }
    
    if(showHideToggles[id]) {
        document.getElementById(id).style.display = 'none';
        showHideToggles[id] = false;
        event.target.innerHTML = 'show';
    } else {
        document.getElementById(id).style.display = 'block';
        showHideToggles[id] = true;
        event.target.innerHTML = 'hide';
    }
}