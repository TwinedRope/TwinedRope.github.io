var TNTAnimationHandle;
var Animating = false;
var currentWarningCount = 0;
var currentWarnings = [];

function PerformanceWarnings() {
    if(numObfuscated > 100) {
        OverObfuscatedWarning();
    } else {
        RemoveOverObfuscatedWarning();
    }
    if(document.getElementById("input").value.length > 800) {
        OverTextedWarning();
    } else {
        RemoveOverTextedWarning();
    }
}

function OverTextedWarning() {
    document.getElementsByClassName("over-texted")[0].style.display = "block";
    document.getElementsByClassName("warning-tnt")[0].style.display = "inline-block";
    if(!Animating) {
        TNTAnimationHandle = setInterval(AnimateTNT, 1000);
        Animating = true;
    }
    if(currentWarnings[0] != true) {
        currentWarnings[0] = true;
        currentWarningCount++;
    }
    document.getElementsByClassName("warning-container")[0].style.height = (64 * currentWarningCount) + 'px';
}

function RemoveOverTextedWarning() {
    document.getElementsByClassName("over-texted")[0].style.display = "none";
    if(currentWarnings[0] == true) {
        currentWarnings[0] == false;
        currentWarningCount--;
    }
    if(currentWarningCount == 0) {
        document.getElementsByClassName("warning-container")[0].style.height = 'auto';
        document.getElementsByClassName("warning-tnt")[0].style.display = "none";
        if(Animating) {
            clearInterval(TNTAnimationHandle);
            Animating = false; //needs to check if any other warnings are present
        }
    }
}

function OverObfuscatedWarning() {
    document.getElementsByClassName("over-obfuscated")[0].style.display = "block";
    document.getElementsByClassName("warning-tnt")[0].style.display = "inline-block";
    if(!Animating) {
        TNTAnimationHandle = setInterval(AnimateTNT, 1000);
        Animating = true;        
    }
    if(currentWarnings[1] != true) {
        currentWarnings[1] = true;
        currentWarningCount++;
    }
    document.getElementsByClassName("warning-container")[0].style.height = (55 * currentWarningCount) + 'px';
}

function RemoveOverObfuscatedWarning() {
    document.getElementsByClassName("over-obfuscated")[0].style.display = "none";
    if(currentWarnings[1] == true) {
        currentWarnings[1] == false;
        currentWarningCount--;
    }
    if(currentWarnings == 0) {
        document.getElementsByClassName("warning-container")[0].style.height = 'auto';
        document.getElementsByClassName("warning-tnt")[0].style.display = "none";
        if(Animating) {
            clearInterval(TNTAnimationHandle);
            Animating = false; //needs to check if any other warnings are present
        }
    }
}

function AnimateTNT() {
    var selector = ".warning-tnt";
    if(document.querySelector(selector).src.includes("Images/TNT.jpg")) {
        document.querySelector(selector).src = 'Images/TNTPrimed.jpg';
    } else {
        document.querySelector(selector).src = 'Images/TNT.jpg';
    }
}