/**
 * COLORS:
 * type text, click color button, click back (it refocuses for you) and then you will being to start typing in that color
 * highlight text, click a color and your highlight will be changed, click back (it will not refocus for you) and you will start typing in that color
 * outline which color you are currently on (measured from the previous letter [or the first letter for when you are at index 0])
 */
var currentColor = '#ffffff';
var colorHighlightFlag = false;

//https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
const RgbToHex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function ColorButton(event) {
    document.getElementsByClassName("selected-color")[0].classList.remove("selected-color");
    event.target.classList.add("selected-color");
    currentColor = RgbToHex(event.target.style.color);
    colorHighlightFlag = true;
    document.getElementById("input").focus();
}

function UpdateCurrentColor() {
    if(lastSelection.length > 0) {
        currentColor = outputArray[cursorPosition].color;    
    } else {
        currentColor = cursorPosition == 0 ? outputArray[cursorPosition].color : outputArray[cursorPosition - 1].color;
    }
    var buttonClass = ColorDecodeHex[currentColor];
    document.getElementsByClassName("selected-color")[0].classList.remove("selected-color");
    document.getElementsByClassName(buttonClass)[0].classList.add("selected-color");
}

function ColorHighlight(selection) {
    for(var i = selection.startIndex; i < selection.endIndex; i++) {
        outputArray[i].color = currentColor;
    }
    RefreshOutput();
}