/**
 * SPECIAL FORMATTING:
 * highlight text, choose format, changes format
 * click on colored block of text, choose format, adjacent colored letters are formatted unless it encounters a different format than what it started with
 * current format is highlighted when selecting text (measured from previous letter [or first letter for when you are at index 0])
 * enchanted and obfuscated text should be implemented as canvases so that other formats can be easily applied
 */
var formatFlag = false; 
var clearFormatFlag = false;
var currentFormats = [];
var newestFormat = '';
var newestWasAdded = undefined; //bool
var noFormatting = true;

var obfuscatedShouldAnimate = true;
var obfuscatedAnimationID;
var numObfuscated = 0;
var enchArray = [];

function FormatInit() {
    if(obfuscatedShouldAnimate) {
        obfuscatedAnimationID = setInterval(PostProcessObfuscated, 100);
    }
}

function AddFormat(event, intType) {
    newestFormat = FormatArr[intType];
    if(!event.target.parentElement.classList.contains("selected-format")) {
        event.target.parentElement.classList.add("selected-format");
        currentFormats.push(FormatArr[intType]);
        newestWasAdded = true;
    } else {
        event.target.parentElement.classList.remove("selected-format");
        currentFormats.splice(currentFormats.indexOf(FormatArr[intType]), 1);
        newestWasAdded = false;
    }
    if(currentFormats.length == 0) {
        noFormatting = true;
        document.getElementsByName("none")[0].parentElement.classList.add("selected-format");
    } else {
        noFormatting = false;
        document.getElementsByName("none")[0].parentElement.classList.remove("selected-format");
    }
    formatFlag = true;
    document.getElementById("input").focus();
}

function ClearFormatting(event) {
    var buttons = document.querySelectorAll(".button.option.formatting > button");
    buttons.forEach(RemoveSelectedClass);
    clearFormatFlag = true;
    currentFormats = [];
    document.getElementsByName("none")[0].parentElement.classList.add("selected-format");
    document.getElementById("input").focus();
}

function RemoveSelectedClass(item, index) {
    if(item.parentElement.classList.contains("selected-format")) {
        item.parentElement.classList.remove("selected-format");
    }
}

function ClearAllFormatHighlight(selection) {
    for(var i = selection.startIndex; i < selection.endIndex; i++) {
        outputArray[i].format = [];
    }
    RefreshOutput();
}

function FormatHighlight(selection) {
    for(var i = selection.startIndex; i < selection.endIndex; i++) {
        if(newestWasAdded && !outputArray[i].format.includes(newestFormat)) {
            outputArray[i].format.push(newestFormat);
        }
        if(!newestWasAdded && outputArray[i].format.includes(newestFormat)) {
            outputArray[i].format.splice(outputArray[i].format.indexOf(newestFormat), 1);
        }
    }
    RefreshOutput();
}

function UpdateCurrentFormat() {
    try {
        if(lastSelection.length > 0) {
            currentFormats = Array.from(outputArray[cursorPosition].format);
        } else {
            currentFormats = cursorPosition == 0 ? Array.from(outputArray[cursorPosition].format) : Array.from(outputArray[cursorPosition - 1].format);
        }
        var buttons = document.querySelectorAll(".button.option.formatting > button");
        buttons.forEach(SetButtonActive);
        
        if(currentFormats.length == 0) {
            noFormatting = true;
            document.getElementsByName("none")[0].parentElement.classList.add("selected-format");
        } else {
            noFormatting = false;
            document.getElementsByName("none")[0].parentElement.classList.remove("selected-format");
        }
    } catch(e) {
        //ignore errors for dialogue generator
    }
}

function SetButtonActive(item, index) {
    var formatName = item.getAttribute('name');
    if(currentFormats.includes(formatName)) {
        item.parentElement.classList.add("selected-format");
    } else if(item.parentElement.classList.contains("selected-format")) {
        item.parentElement.classList.remove("selected-format");
    }
}

function PostProcessFormats() {
    var enchantedText = document.querySelectorAll("span.enchanted");
    for(var i = 0; i < enchantedText.length; i++) {
        if(!enchantedText[i].classList.contains("space"))
            ProcessEnchanted(enchantedText[i], enchantedText[i].getAttribute('index'));
    }
    //strict order; obfuscated overrides enchanted text
    PostProcessObfuscated();
}

//needed to split this off for animation purposes
function PostProcessObfuscated() {
    var obfuscatedText = document.querySelectorAll("span.obfuscated");
    numObfuscated = obfuscatedText.length;
    for(var i = 0; i < obfuscatedText.length; i++) {
        if(!obfuscatedText[i].classList.contains("space"))
            ProcessObfuscated(obfuscatedText[i], obfuscatedText[i].getAttribute('index'));
    }
}

function ProcessObfuscated(item, index) {
    item.innerHTML = '';

    var canvas = document.createElement("canvas");
    canvas.style.width = '18.02px';
    canvas.style.height = '18.02px';
    canvas.style.position = 'relative';
    canvas.style.top = '0px';
    canvas.style.backgroundColor = outputArray[index].color;
    item.appendChild(canvas);
    var imgId = item.classList.contains("bold") ? "obfuscated00Bold" : "obfuscated00";
    var img = document.getElementById(imgId);

    var context = canvas.getContext("2d");

    if(item.classList.contains("italic")) {
        ProcessObfuscatedItalic(context, img);
    }

    obfIndex = 36 * Math.floor(Math.random() * 47);
    context.drawImage(img, obfIndex, 0, 36, 36, 0, 0, 300, 150);
    
    //Underline works on its own

    if(item.classList.contains("strikethrough")) {
        ProcessSpecialStrikethrough(item);
    }
}

function ProcessObfuscatedItalic(context, img) {
    context.transform(1, 0, -0.75, 1, 60, 0);
    //drawing more to cover the corners after shearing
    context.drawImage(img, -300, 0, 300, 150);
    context.drawImage(img, 300, 0, 300, 150);
}

function ToggleObfuscatedAnimation() {
    if(obfuscatedShouldAnimate) {
        clearInterval(obfuscatedAnimationID);
        obfuscatedShouldAnimate = false;
    } else {
        obfuscatedAnimationID = setInterval(PostProcessObfuscated, 100);
        obfuscatedShouldAnimate = true;
    }
}

function UpdateEnchArray(index) {
    while(index >= enchArray.length) {
        const nextEnchLetter = "enchanted0" + Math.floor(Math.random() * 7);;
        enchArray.push(nextEnchLetter);
    }
}

function ProcessEnchanted(item, index) {
    UpdateEnchArray(index);
    item.innerHTML = '';
    item.height = "34px";
    item.width = '18.02px';
    
    var canvas = document.createElement("canvas");
    canvas.style.width = '16.02px';
    canvas.style.height = '18.02px';
    canvas.style.position = 'relative';
    canvas.style.top = '0px';
    canvas.style.marginRight = '2px';
    canvas.style.backgroundColor = outputArray[index].color;
    item.appendChild(canvas);
    var context = canvas.getContext("2d");
    
    var enchId = enchArray[index];
    if(item.classList.contains("bold")) {
        //ProcessEnchantedBold(context, canvas);
        enchId += "Bold";
    }
    var enchImg = document.getElementById(enchId);

    //strict ordering: .transform only affects the next images
    if(item.classList.contains("italic")) {
        ProcessEnchantedItalic(context, enchImg);
    }
    //Underline works on its own
    if(item.classList.contains("strikethrough")) {
        ProcessSpecialStrikethrough(item);
    }
    context.drawImage(enchImg, -2, 3, 400, 200);
}

function ProcessEnchantedItalic(context, enchImg) {
    context.transform(1, 0, -0.75, 1, 2.5, 0);
    //drawing more to cover the corners after shearing
    context.drawImage(enchImg, -18, 0, 18, 18);
    context.drawImage(enchImg, 18, 0, 18, 18);
}

/* DEPREICATED: */
function ProcessEnchantedBold(context, canvas) {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < 4; i++) {
        for(var k = 0; k < imageData.data.length - 4; k += 4) {
            if(imageData.data[k + 3] <= 10) {
                imageData.data[k - 1] = 0;
                imageData.data[k - 5] = 0;
            }
        }
    }
    context.putImageData(imageData, 0, 0); //corss-origin data errors. Use you server for testing this
}

//works for both enchanted and obfuscated text
function ProcessSpecialStrikethrough(item) {
    var newSpan = document.createElement("span");
    newSpan.style.width = '18.02px';
    newSpan.style.height = '3px';
    newSpan.style.position = 'absolute'
    newSpan.style.top = (14.5 + item.offsetTop) + 'px';
    newSpan.style.left = (item.offsetLeft) + 'px';
    newSpan.style.backgroundColor = item.style.color;
    item.appendChild(newSpan);
}