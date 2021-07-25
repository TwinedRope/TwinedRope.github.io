/**
 * GENERAL:
 * Text is replicated in "Current Output" field
 * shadow cursor is present for the last selected character (useful for events and debugging)
 */
function General() {
    console.log("General Test");
}

var overridecCheckboxClick = false;

function TransferCheckboxClick(id) {
    if(!overridecCheckboxClick)
        document.getElementById(id).click();
}

function TransferCheckboxStyling(id, value) {
    if(value) {
        document.getElementById(id).parentElement.classList.add('text-triggered-checkbox-hover');
    } else {
        document.getElementById(id).parentElement.classList.remove('text-triggered-checkbox-hover');
    }
}