        /*
            Colored Obfuscated Text (no formatting):
            White: https://i.imgur.com/nGHYnz6.gif
            Black: https://i.imgur.com/bwhjfKX.gif
            Gray: https://i.imgur.com/EcQK22U.gif
            Dark Gray: https://i.imgur.com/ItAzqeH.gif
            Light Purple: https://i.imgur.com/9OuZBSV.gif
            Dark Purple: https://i.imgur.com/cfDTmaW.gif
            Aqua: https://i.imgur.com/wZPNC6C.gif
            Dark Aqua: https://i.imgur.com/r0y1BpH.gif
            Blue: https://i.imgur.com/PPOSTCU.gif
            Dark Blue: https://i.imgur.com/AqY4pKB.gif
            Green: https://i.imgur.com/KgZMsLH.gif
            Dark Green: https://i.imgur.com/fLky7P5.gif
            Yellow: https://i.imgur.com/dhdt90t.gif
            Gold: https://i.imgur.com/v7ULOzP.gif
            Red: https://i.imgur.com/s1KD6vZ.gif
            Dark Red: https://i.imgur.com/fPDPIh2.gif
        
            Colored Obfuscated Text (Bold):
            White: https://i.imgur.com/ZO5hr2l.gif
            Black: https://i.imgur.com/qygmDTL.gif
            Gray: https://i.imgur.com/PbtuEDz.gif
            Dark Gray:https://i.imgur.com/PbtuEDz.gif
            Light Purple: https://i.imgur.com/fY4wcB9.gif
            Dark Purple: https://i.imgur.com/1mN05tw.gif
            Aqua: https://i.imgur.com/HRO2lQj.gif
            Dark Aqua: https://i.imgur.com/sx3VsVg.gif
            Blue: https://i.imgur.com/WX86aGO.gif
            Dark Blue: https://i.imgur.com/Kvz6acE.gif
            Green: https://i.imgur.com/qahwd0I.gif
            Dark Green: https://i.imgur.com/ew1VSRp.gif
            Yellow: https://i.imgur.com/xObC535.gif
            Gold: https://i.imgur.com/AJ5nrLH.gif
            Red: https://i.imgur.com/wOmlIXV.gif
            Dark Red: https://i.imgur.com/jiqyxXn.gif

            Colored Obfuscated Text (Italic):
            White: https://i.imgur.com/XVu1tzB.gif
            Black: https://i.imgur.com/TxkNmw3.gif
            Gray: https://i.imgur.com/HK11R0E.gif
            Dark Gray: https://i.imgur.com/2YW9SlC.gif
            Light Purple: https://i.imgur.com/AF8HBFl.gif
            Dark Purple: https://i.imgur.com/LZC1sjV.gif
            Aqua: https://i.imgur.com/IRwFIzj.gif
            Dark Aqua: https://i.imgur.com/cafNOzD.gif
            Blue: https://i.imgur.com/jkYhoLr.gif
            Dark Blue: https://i.imgur.com/k6rhCxQ.gif
            Green: https://i.imgur.com/Vxmw3gC.gif
            Dark Green: https://i.imgur.com/h4j8l9q.gif
            Yellow: https://i.imgur.com/bZLV3o4.gif
            Gold: https://i.imgur.com/M4iIlcf.gif
            Red: https://i.imgur.com/431PSra.gif
            Dark Red: https://i.imgur.com/yiNPUyc.gif

            Colored Obfuscated Text (Bold and Italic):
            White: https://i.imgur.com/jpyT8xO.gif
            Black: https://i.imgur.com/eW32MBu.gif
            Gray: https://i.imgur.com/6uJsovp.gif
            Dark Gray: https://i.imgur.com/dj0Nebv.gif
            Light Purple: https://i.imgur.com/b1PjA4r.gif
            Dark Purple: https://i.imgur.com/BLEupwj.gif
            Aqua: https://i.imgur.com/PUNIqzO.gif
            Dark Aqua: https://i.imgur.com/YdlDHUp.gif
            Blue: https://i.imgur.com/KkvDIlH.gif
            Dark Blue: https://i.imgur.com/8ht7V2X.gif
            Green: https://i.imgur.com/51lZvOQ.gif
            Dark Green: https://i.imgur.com/Njx9dnh.gif
            Yellow: https://i.imgur.com/3TEqyHx.gif
            Gold: https://i.imgur.com/3beFCnC.gif
            Red: https://i.imgur.com/EgSxI1s.gif
            Dark Red: https://i.imgur.com/flTUHsz.gif
        
        */
        var formatDict = {
            0: "bold",
            1: "italic",
            2: "underline",
            3: "strikethrough",
            4: "obfuscated",
            5: "enchanted"
        };

        var colorDecode = {
            0: "white",                                                                                           //TODO: Replace with appropraite color codes (Not sure if I will need Hex or RGB)
            1: "black"
        }

        var colorEncode = {
            "rbg(255, 255, 255)" : 0,
            "rgb(0, 0, 0)" : 1,
            "rgb(170, 170, 170)" : 2,
            "rgb(85, 85, 85)" : 3,
            "rgb(255, 85, 255)" : 4,
            "rgb(170, 0, 170)" : 5,
            "rgb(85, 255, 255)" : 6,
            "rgb(0, 170, 170)" : 7,
            "rgb(85, 85, 255)" : 8,
            "rgb(0, 0, 170)" : 9,
            "rgb(85, 255, 85)" : 10,
            "rgb(0, 170, 0)" : 11,
            "rgb(255, 255, 85)": 12,
            "rgb(255, 170, 0)" : 13,
            "rgb(255, 85, 85)" : 14,
            "rgb(170, 0, 0)" : 15
        }


        function Initialize() {
            //strict ordering with respect to the order of the format buttons onscreen
            formatArray.push(boldIndexes);
            formatArray.push(italicIndexes);
            formatArray.push(underlineIndexes);
            formatArray.push(strikethroughIndexes);
            formatArray.push(obfuscatedIndexes);
            formatArray.push(enchantedIndexes);
            for(var i = 0; i < formatArray.length; i++) {
                formatLock.push(false);
                formatValue.push(undefined);
            }

            //Initializing Textarea input
            document.getElementById("input").click();
            document.getElementById("input").blur();
        }

        function Submit() {
            console.log("Submitted...");
        }

        function Select(event, buttonClassName, contentClass, contentID) {
            event.target.blur();
            if(event.target.classList.contains('selected')) {
                return;
            } else {
                var selectors = document.getElementsByClassName(buttonClassName);
                for(var i = 0; i < selectors.length; i++) {
                    selectors[i].classList.remove('selected');
                    selectors[i].getElementsByTagName("button")[0].classList.remove('selected');
                    //console.log("Removed selected from a button..." + selectors[i].classList);
                }
                var allContent = document.getElementsByClassName(contentClass);
                for(var i = 0; i < allContent.length; i++) {
                    allContent[i].style.display = 'none';
                    //console.log("Set display to none for content block")
                }
                var contentContainter = document.getElementById(contentID).style.display = 'block';
                event.target.classList += 'selected';
            }
        }

        var inputArray = [ '' ];
        var colorArray = [ 'rgb(255, 255, 255)' ];
        var cursorArray = [ 0 ];
        var startArray = [ 0 ];
        var setStartPosition = false;
        var startPositionSpliced = false;
        var inputIndex = 0;
        var inputIndexColorLock = false;

        var lastSelectionEnd;
        var lastSelectionStart = 0;
        var lastLength = 0;

        var fakeCursorOffset = 35; //px

        function Color(inputStr, event) {
            //removes any unused empty yet colored arrays for when you are switching between multiple colors but not typing
            GarbageCollectArrays();

            //disallows multiple creations of empty colored strings
            if(event.target.classList.contains("selected-color")) {
                return;
            }

            document.getElementsByClassName("selected-color")[0].classList.remove("selected-color");
            event.target.parentElement.classList += " selected-color";
            console.log(event.target.classList);
            event.target.blur();
            inputIndexColorLock = true;
            if(lastSelectionStart != lastSelectionEnd) {
                inputIndexColorLock = false;
                HandleColorHighlight();
            }
            for(var i = 0; i < inputArray.length; i++) {
                console.log("[Input " + i + "]: " + inputArray[i] + "\n[Color " + i + "]: " + colorArray[i] + "\n[Length " + i + "]: " + cursorArray[i] + "\n[Start " + i + "]: " + startArray[i] + "\nInput Index: " + inputIndex);
            }
        }

        //each array has a valid value or undefined (false for booleaned arrays) corresponding to each index in the masterString array, which is ordered
        var masterString = new Array(); //string type
        var masterColor = new Array(); //string type, specifically and rgb() color
        var masterHoverEvent = new Array(); //string type, text to be displayed for the corresponding hover event
        var masterClickEvent = new Array(); //string type, a Minecraft command to be run for the corresponding click event

        var masterBold = new Array(); //boolean type
        var masterItalic = new Array(); //bool
        var masterObfuscated = new Array(); //bool
        var masterStrikethrough = new Array(); //bool

        var obfuscatedAnimationIntervalID;
        var obfuscatedShouldAnimate = true;

        function RecalculateOutput() {
            clearInterval(obfuscatedAnimationIntervalID);

            var outputString = '';
            var masterIndex = 0;
            
            masterString = new Array();
            masterPosition = new Array(); //Not used in encoding, but in manual word-wrapping
            masterColor = new Array();
            masterHoverEvent = new Array();
            masterClickEvent = new Array();

            masterFormat = new Array();
            
            for(var i = 0; i < inputArray.length; i++) {
                console.log(i + ": " + startArray[i] + ", " + cursorArray[i] + ", " + inputArray[i].substring(0, 0 + 1));
                for(var j = startArray[i]; j < startArray[i] + cursorArray[i]; j++) {
                    //preparing for master array creation...
                    var currentHoverEvent = undefined;
                    var currentClickEvent = undefined;
                    var formats = new Array(formatArray.length);

                    if(hoverIndexes[j] != undefined) {
                        currentHoverEvent = hoverEvent[hoverIndexes[j]];
                    }
                    if(clickIndexes[j] != undefined) {
                        currentClickEvent = clickEvent[clickIndexes[j]];
                    }
                    for(var f = 0; f < formatArray.length; f++) {
                        formats[f] = formatArray[f][j];
                    }

                    newFormat = false;
                    for(var f = 0; f < formats.length; f++) {
                        if(masterFormat[masterIndex] != undefined && masterFormat[masterIndex][f] != formats[f]) {
                            newFormat = true;
                        }
                    }

                    //note, no need to check for colors since this is already split via the i index
                    if(masterClickEvent[masterIndex] != currentClickEvent || masterHoverEvent[masterIndex] != currentHoverEvent || newFormat) {
                        //something changed, we need to add it to a new "entry" of our master array
                        masterIndex++;
                    }

                    //these if statements only fire if we are on a new masterIndex (or the first masterIndex)
                    if(masterColor.length - 1 < masterIndex) {
                        masterColor[masterIndex] = colorArray[i];
                    }
                    if(masterClickEvent.length - 1 < masterIndex) {
                        masterClickEvent[masterIndex] = currentClickEvent;
                    }
                    if(masterHoverEvent.length - 1 < masterIndex) {
                        masterHoverEvent[masterIndex] = currentHoverEvent;
                    }
                    if(masterFormat.length - 1 < masterIndex) {
                        masterFormat[masterIndex] = formats;
                    }
                    if(masterString[masterIndex] == undefined) {
                        masterString[masterIndex] = inputArray[i].substring(j - startArray[i], j - startArray[i] + 1);
                        masterPosition[masterIndex] = j;
                    } else {
                        masterString[masterIndex] += inputArray[i].substring(j - startArray[i], j -startArray[i] + 1);
                        masterPosition[masterIndex] = j;
                    }
                    //console.log(masterString[masterIndex] + ", " + j);
                }
                masterIndex++; //we reached the end of a color
            }
            //there are 18px per character (output font in monospace)
            var maxChars = Math.trunc(document.getElementsByClassName("current-output")[0].clientWidth / 18);
            var renderedChars = 0;
            for(var m = 0; m < masterString.length; m++) {
                //console.log("Master Array: Click Event at [" + m + "]: " + masterClickEvent[m]);
                outputString += '<span style="color: ' + masterColor[m];
                if(masterHoverEvent[m] != undefined && masterClickEvent[m] != undefined) {
                    outputString += '; cursor: pointer;" onmousemove="HoverNotification(true, \'' + masterHoverEvent[m] + '\', event)" onmouseenter="ClickNotification(true)" onmouseleave="HoverNotification(false, \'' + masterHoverEvent[m] + '\', event);ClickNotification(true);" onclick="ClickPreview(\'' + masterClickEvent[m] + '\')" class="hover-event click-event ';
                } else if(masterClickEvent[m] != undefined) {
                    outputString += '; cursor: pointer;" onmouseenter="ClickNotification(true)" onmouseleave="ClickNotification(false)" onclick="ClickPreview(\'' + masterClickEvent[m] + '\')" class="click-event ';
                } else if(masterHoverEvent[m] != undefined) {
                    outputString += ';" onmousemove="HoverNotification(true, \'' + masterHoverEvent[m] + '\', event)" onmouseleave="HoverNotification(false, \'' + masterHoverEvent[m] + '\', event)" class="hover-event ';
                } else {
                    outputString += '" class="';
                }

                if(masterFormat[m] != undefined) {
                    for(var i = 0; i < masterFormat[m].length; i++) {
                        if(masterFormat[m][i]) {
                            outputString += formatDict[i] + " ";
                            //console.log("Added format " + formatDict[i]);
                        }
                    }
                }
                outputString += '">';

                if(masterString[m] != undefined) {
                    //deals with manual word wrapping
                    //console.log("Absolute End: " + masterPosition[m]);
                    if(masterPosition[m] >= maxChars) {
                        var stringLength = masterString[m].length;
                        var absoluteStart = masterPosition[m] - stringLength + 1; //positioned via array-like index
                        var relativeStart = absoluteStart % maxChars;
                        var linesSpanned = Math.trunc((relativeStart + stringLength) / maxChars) + 1;
                        //console.log("Lines Spanned: " + linesSpanned);
                        var finalLineRelativeEnd = masterPosition[m] % maxChars;
                        var stringIndex = 0;          
                        
                        //console.log("Line Relative End: " + (masterPosition[m] % maxChars));
                        for(var l = 0; l < linesSpanned; l++) {
                            if(l == 0) {
                                var wrappedString = masterString[m].substring(0, maxChars - relativeStart); //from the start of the string to the end of this line
                                //console.log("Wrapped String (Start): " + wrappedString);
                                //outputString += wrappedString;
                                outputString += HandleObfuscatedEnchanted(m, wrappedString);
                                if(linesSpanned > 1) {
                                    outputString += '<br>'
                                }
                            } else if(l < linesSpanned - 1) {
                                var lineStart = maxChars * l - relativeStart; //note: time L, not 1
                                var wrappedString = masterString[m].substring(lineStart, lineStart + maxChars);
                                //console.log("Wrapped String (Mid): " + wrappedString);
                                //outputString += wrappedString + '<br>';
                                outputString += HandleObfuscatedEnchanted(m, wrappedString);
                                outputString += '<br>';
                            } else {
                                var lineStart = maxChars * l - relativeStart; //note: time L, not 1
                                var wrappedString = masterString[m].substring(lineStart, masterString[m].length);
                                //console.log("Wrapped String (End): " + wrappedString);
                                //outputString += wrappedString;
                                outputString += HandleObfuscatedEnchanted(m, wrappedString);
                                if(finalLineRelativeEnd == maxChars - 1 && wrappedString.length > 0) {
                                    outputString += '<br>';
                                }
                            }
                        }
                        outputString += '</span>';
                    } else {                        
                        //outputString += masterString[m] + '</span>';
                        outputString += HandleObfuscatedEnchanted(m, masterString[m]);
                        outputString += '</span>';
                    }
                } else {
                    outputString += '</span>';
                }
            }
            outputString += '</span>';
            document.getElementsByClassName("current-output")[0].innerHTML = outputString;

            PostProcessFormatting();

            GarbageCollectArrays();

            HighlightClickEvents();
            HighlightHoverEvents();
        }

        // var obfuscatedChars = [ 'https://i.imgur.com/EvFpeRZ.gif',
        //                         'https://i.imgur.com/McVPHnf.gif',
        //                         'https://i.imgur.com/3k27gCD.gif',
        //                         'https://i.imgur.com/AUepQ5Q.gif',
        //                         'https://i.imgur.com/UowPVU1.gif',
        //                         'https://i.imgur.com/H95pFo7.gif',
        //                         'https://i.imgur.com/VpMWtC0.gif',
        //                         'https://i.imgur.com/VFwdKtQ.gif',
        //                         'https://i.imgur.com/9LQNq6Z.gif',
        //                         'https://i.imgur.com/0YuzFwY.gif' ];
        // var enchantedChars = [  'https://i.imgur.com/zZHGVrs.png',
        //                         'https://i.imgur.com/nXg0dNE.png',
        //                         'https://i.imgur.com/JInolwF.png',
        //                         'https://i.imgur.com/nuXairo.png',
        //                         'https://i.imgur.com/djwB4x1.png',
        //                         'https://i.imgur.com/EHTDbHN.png',
        //                         'https://i.imgur.com/vznI6zF.png',
        //                         'https://i.imgur.com/WzJwIna.png' ];

        var obfuscatedChars = [ '' ]; //image paths need to be relative to the Image folder (the one adjacent to this html)
        var enchantedChars = [ 'Images/Enchanted00.PNG' ];

        function HandleObfuscatedEnchanted(m, wrappedString) {                                             //TODO: Reduce to one character and add Colors, Bold, Italic, and Bold and Italic. Create a way to do strikethroughs on top of obfuscated
            var outputString = '';
            if(masterFormat[m][4]) {
                //obfuscated or obfuscated and enchanted (which is just obfuscated)
                outputString += CreateObfuscatedFrame(wrappedString, m);
            } else if(masterFormat[m][5]) {                                                                 //TODO: Reduce to one character and add Colors Bold, Italic, and Bold and Italic. Create a way to do strikethrough on top of obfuscated
                //enchanted
                outputString += CreateEnchantFrame(wrappedString, m); //opted to implement all forms via a canvas
                //All special formatting (bold, italic, and strikethrough) will happen after rendering the characters
            } else {
                outputString = wrappedString;
            }
            return outputString;
        }

        function CreateEnchantFrame(wrappedString, m) {
            var outputString = '.<div style="width: 0px; display: inline-block; position: relative; left: -18px; top: 0px;"><canvas';
            for(var i = 0; i < wrappedString.length; i++) {
                outputString += ' width="18" height="18" style="width:18px; height: 18px; background-color: ' + masterColor[m] + ';">Your browser does not support the HTML5 canvas tag</canvas></div>';
                if(i != wrappedString.length - 1) {
                    outputString += '.<div style="width: 0px; display: inline-block; position: relative; left: -18px; top: 0px;"><canvas';
                }
            }
            return outputString;
        }

        function CreateObfuscatedFrame(wrappedString, m) {
            var outputString = '.<div style="width: 0px; display: inline-block; position: relative; left: -18px; top: 0px;"><canvas';
            for(var i = 0; i < wrappedString.length; i++) {
                outputString += ' width="18" height="18" style="background-color: ' + masterColor[m] + ';">Your browser does not support the HTML5 canvas tag</canvas></div>';
                if(i != wrappedString.length - 1) {
                    outputString += '.<div style="width: 0px; display: inline-block; position: relative; left: -18px; top: 0px;"><canvas';
                }
            }
            return outputString;
        }

        function PostProcessFormatting(m) {
            //handles strikethroughs, italics, and bolds
            var enchantedSpans = document.getElementsByClassName("enchanted");
            console.log("Found " + enchantedSpans.length + " spans");
            for(var i = 0; i < enchantedSpans.length; i++) {
                console.log(i + "-th span...");
                var eClasses = enchantedSpans[i].classList;
                var allDivs = enchantedSpans[i].getElementsByTagName("div");
                console.log("All Divs: " + allDivs.length);
                for(var j = 0; j < allDivs.length; j++) {
                    var currentCanvas = allDivs[j].getElementsByTagName("canvas")[0];
                    console.log("Found Canvas: " + currentCanvas);
                    var id = "enchanted0" + Math.floor(Math.random() * 7);
                    var img = document.getElementById(id);

                    var context = currentCanvas.getContext("2d");                    
                    img.context = context; //to "pass" these things as "parameters" in the onload function
                    img.eClasses = eClasses;

                    //strict ordering: .transform only affects the next images
                    if(eClasses.contains("italic")) {
                        context.transform(1, 0, -0.25, 1, 2.5, 0);
                        //drawing more to cover the corners after shearing
                        context.drawImage(img, -18, 0, 18, 18);
                        context.drawImage(img, 18, 0, 18, 18);
                    }

                    context.drawImage(img, 0, 0, 18, 18);
                    
                    if(eClasses.contains("bold")) {
                        var imageData = context.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
                        for(var k = 0; k < imageData.data.length - 4; k += 4) {
                            if(imageData.data[k + 3] <= 10) {
                                imageData.data[k - 1] = 0;
                                imageData.data[k - 5] = 0;
                            }
                        }
                        context.putImageData(imageData, 0, 0);
                    }

                    //Underline works on its own

                    if(eClasses.contains("strikethrough")) {
                        var imageData = context.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
                        var midIndex = 480;
                        var rowLength = 120;
                        imageData.data[midIndex + 3] = 0;
                        for(var k = midIndex; k < midIndex + (rowLength * 2); k += 4) {
                            imageData.data[k + 3] = 0;
                        }
                        context.putImageData(imageData, 0, 0);
                        //fails by modifying the data of allDivs, which is used in the end condition of the for
                        //allDivs[k].innerHTML += '<div style="width:18px; height:3px; background-color:' + enchantedSpans[i].style.color + '; position: relative; top: 10px; left: 0px;"></div>';
                    }
                }
            }

            //doing obfuscated formatting second allows it to override enchant in the case of both being active
            var obfuscatedSpans = document.getElementsByClassName("obfuscated");
            for(var i = 0; i < obfuscatedSpans.length; i++) {
                var oClasses = obfuscatedSpans[i].classList;
                var allDivs = obfuscatedSpans[i].getElementsByTagName("div");
                for(var j = 0; j < allDivs.length; j++) {
                    var currentCanvas = allDivs[j].getElementsByTagName("canvas")[0];
                    var img = document.getElementById("obfuscated00");

                    var context = currentCanvas.getContext("2d");

                    if(oClasses.contains("italic")) {
                        context.transform(1, 0, -0.25, 1, 2.5, 0);
                        //drawing more to cover the corners after shearing
                        context.drawImage(img, -18, 0, 18, 18);
                        context.drawImage(img, 18, 0, 18, 18);
                    }

                    obfIndex = 36 * Math.floor(Math.random() * 47);
                    context.index = obfIndex;
                    if(obfuscatedShouldAnimate) {
                        context.drawImage(img, obfIndex, 0, 36, 36, 0, 0, 18, 18);
                    }
                    
                    //Underline works on its own

                    if(oClasses.contains("strikethrough")) {

                    }
                }
            }

            //Animate Obfuscated text
            if(obfuscatedShouldAnimate) {
                obfuscatedAnimationIntervalID = setInterval(AnimateObfucsatedText, 100);
            }
        }

        function AnimateObfucsatedText() {
            var totalDivs = 0;
            var obfuscatedSpans = document.getElementsByClassName("obfuscated");
            for(var i = 0; i < obfuscatedSpans.length; i++) {
                var oClasses = obfuscatedSpans[i].classList;
                var allDivs = obfuscatedSpans[i].getElementsByTagName("div");
                totalDivs += allDivs.length;
                for(var j = 0; j < allDivs.length; j++) {
                    var currentCanvas = allDivs[j].getElementsByTagName("canvas")[0];
                    var img = document.getElementById("obfuscated00");
                    var context = currentCanvas.getContext("2d");
                    context.index += 36;
                    context.index = context.index % 1692;
                    context.clearRect(0, 0, 18, 18);
                    context.drawImage(img, context.index, 0, 36, 36, 0, 0, 18, 18);

                    if(oClasses.contains("bold")) {
                        var imageData = context.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
                        for(var k = 0; k < imageData.data.length - 4; k += 4) {
                            if(imageData.data[k + 3] <= 10) {
                                imageData.data[k - 1] = 0;
                                imageData.data[k - 5] = 0;
                            }
                        }
                        context.clearRect(0, 0, 18, 18);
                        context.putImageData(imageData, 0, 0);
                    }

                    if(oClasses.contains("strikethrough")) {
                        var imageData = context.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
                        var midIndex = 480;
                        var rowLength = 120;
                        imageData.data[midIndex + 3] = 0;
                        for(var k = midIndex; k < midIndex + (rowLength * 2); k += 4) {
                            imageData.data[k + 3] = 0;
                        }
                        context.putImageData(imageData, 0, 0);
                    }
                }
            }
            if(totalDivs > 150) {
                document.getElementById("obfWarning").style.display = "block";
            } else {
                document.getElementById("obfWarning").style.display = "none";
            }
        }

        function ToggleObfuscatedAnimation() {
            obfuscatedShouldAnimate = !obfuscatedShouldAnimate;
            if(!obfuscatedShouldAnimate) {
                clearInterval(obfuscatedAnimationIntervalID);
            } else {
                obfuscatedAnimationIntervalID = setInterval(AnimateObfucsatedText, 100);
            }
        }


        function UpdateInput(event) {
            var lengthDif = event.target.value.length - lastLength;

            UpdateCursor(event, lengthDif);
            inputArray[inputIndex] = event.target.value.substring(startArray[inputIndex], startArray[inputIndex] + cursorArray[inputIndex]);
            UpdateinputIndex(event, lengthDif);

            AutoSizeInput(event);

            lastLength = event.target.value.length;
            console.log("UpdateInput found color: " + colorArray[inputIndex]);
            ResetColorButtons(colorArray[inputIndex]);
            startPositionSpliced = false;

            RecalculateOutput();

            DebugInputField();
        }

        function DebugInputField() {
            for(var i = 0; i < inputArray.length; i++) {
                console.log("[Input " + i + "]: " + inputArray[i] + "\n[Color " + i + "]: " + colorArray[i] + "\n[Length " + i + "]: " + cursorArray[i] + "\n[Start " + i + "]: " + startArray[i] + "\nInput Index: " + inputIndex);
            }
        }

        function OnlyIfArrows(event) {
            //Keycodes in the range 33-40 are the arrow keys' codes, home, end, page up, and page down
            if(event.keyCode <= 40 && event.keyCode >= 33) {
                UpdateinputIndex(event, event.target.value.length - lastLength);
            }
        }

        var ReUpdate = false;

        function UpdateSelectionVars(event) {                                                                                                       //TODO: Add a fake cursor in output div?
            lastSelectionStart = event.target.selectionStart;
            lastSelectionEnd = event.target.selectionEnd;
            ReUpdate = !ReUpdate;

            if(inputIndexColorLock) {
                //we don't want to update the starting position until the user actually types something
                inputIndex++;
                setStartPosition = true;
                console.log(setStartPosition);
                if(lastSelectionEnd < event.target.value.length) {
                    startPositionSpliced = true;
                    console.log("Primed for splice...");
                } else {
                    startPositionSpliced = false;
                    console.log("Un-Primed for splice...");
                }
            }
            console.log("Updated start to: " + lastSelectionStart + " and end to: " + lastSelectionEnd);

            //Updates cursor logic for click event inputs
            if(clickIndexes[lastSelectionStart] != undefined) {
                document.getElementById("click-event-input").value = clickEvent[clickIndexes[lastSelectionStart]];
            } else {
                document.getElementById("click-event-input").value = '';
            }

            //Updates cursor logic for hover event inputs
            if(hoverIndexes[lastSelectionStart] != undefined) {
                document.getElementById("hover-event-input").value = hoverEvent[hoverIndexes[lastSelectionStart]];
            } else {
                document.getElementById("hover-event-input").value = '';
            }

            var hasAnyFormatting = false;
            for(var i = 0; i < formatArray.length; i++) {
                if(!formatLock[i]) {
                    var j = 0;
                    if(lastSelectionStart == 0) {
                        j = lastSelectionStart;
                    } else {
                        j = lastSelectionStart - 1;
                    }
                    if(formatArray[i][j]) {
                        document.getElementsByClassName("formatting")[i + 1].classList.add("selected-format");
                        hasAnyFormatting = true;
                    } else {
                        document.getElementsByClassName("formatting")[i + 1].classList.remove("selected-format");
                    }
                } else {
                    if(!hasAnyFormatting) {
                        hasAnyFormatting = formatValue[i];
                    }
                }
            }
            if(hasAnyFormatting) {
                document.getElementsByClassName("formatting")[0].classList.remove("selected-format");
            } else {
                document.getElementsByClassName("formatting")[0].classList.add("selected-format");
            }

            //required for ensuring that the correct position is found after the user has just highlighted something. Could cause issues if the user changes the input before 1ms after clicking on the field (unlikely)
            if(ReUpdate) { 
                setTimeout(function() {UpdateSelectionVars(event);}, 1);
            }
        }

        function UpdateCursor(event, lengthDif) {
            if(lengthDif < 0) {
                inputIndexColorLock = false;
                //some deletion happened. Figure out what happened and where we are...
                if(lengthDif == lastSelectionStart - lastSelectionEnd) {
                    //we pressed delete/backspace after highlighting something
                    HandleHighlightDeletion(lengthDif); //includes garbage collection
                    
                    //event handles
                    hoverIndexes.splice(lastSelectionStart, lastSelectionEnd - lastSelectionStart);
                    clickIndexes.splice(lastSelectionStart, lastSelectionEnd - lastSelectionStart);

                } else {
                    var pressedDelete = false;
                    //we just pressed delete/backspace
                    if(lastSelectionStart == startArray[inputIndex] + cursorArray[inputIndex] && event.target.selectionStart == lastSelectionStart) {
                        //clickEvent handling
                        if(onClickEventIndex != -1) {
                            console.log("Used normal deletion method");
                            clickRelativeEnd[onClickEventNextIndex]--;
                        }

                        inputArray[inputIndex + 1] = inputArray[inputIndex + 1].substring(1, inputArray[inputIndex + 1].length);
                        cursorArray[inputIndex + 1]--;
                        startArray[inputIndex + 1]++;
                        pressedDelete = true;
                    } else {
                        cursorArray[inputIndex]--;
                        if(event.target.selectionStart == lastSelectionStart && cursorArray[inputIndex] == 0 && cursorArray.length > 1) { //determines if we pressed delete at a critical position
                            inputIndex++;
                            pressedDelete = true;
                        }
                    }
                    GarbageCollectArrays(pressedDelete);
                    
                    if(pressedDelete) {
                        //event and format handling
                        hoverIndexes.splice(lastSelectionStart, 1);
                        clickIndexes.splice(lastSelectionStart, 1);
                        for(var f = 0; f < formatArray.length; f++) {
                            formatArray[f].splice(lastSelectionStart, 1);
                        }
                    } else {
                        //event and format handling
                        hoverIndexes.splice(lastSelectionStart - 1, 1);
                        clickIndexes.splice(lastSelectionStart - 1, 1);
                        for(var f = 0; f < formatArray.length; f++) {
                            formatArray[f].splice(lastSelectionStart - 1, 1);
                        }
                    }
                    console.log("UpdateCursor found color: " + colorArray[inputIndex]);
                    ResetColorButtons(colorArray[inputIndex]);
                    
                    //updates starting positions
                    var currentInputIndex = inputIndex;
                    while(currentInputIndex < inputArray.length - 1) {
                        currentInputIndex++;
                        startArray[currentInputIndex] += lengthDif;
                        console.log("Attempted startArrayUpdates");
                    }
                }
            } else if(lengthDif > 0) {
                //only sets the start position if you have clicked and start typeing
                console.log("setStartPosition: " + setStartPosition);
                if(setStartPosition) {
                    if(!startPositionSpliced) {
                        inputArray.push('');
                        colorArray.push(document.getElementsByClassName("selected-color")[0].style.color);
                        cursorArray.push(0);
                        startArray.push(undefined);
                        startArray[inputIndex] = lastSelectionStart;                        
                    } else {
                        HandleColorInsertion(event, lengthDif);
                    }
                    setStartPosition = false;
                    inputIndexColorLock = false;
                } else {
                    //updates starting positions
                    var currentInputIndex = inputIndex;
                    while(currentInputIndex < inputArray.length - 1) {
                        currentInputIndex++;
                        startArray[currentInputIndex] += lengthDif;
                        //console.log("Attempted startArrayUpdates ");
                    }
                }
                cursorArray[inputIndex] += lengthDif;
                GarbageCollectArrays();

                //event and format handling
                for(var i = 0; i < lengthDif; i++) {
                    //continues the hoverIndexes array depending on if an event is present
                    if(hoverIndexes[lastSelectionStart] != undefined) {
                        hoverIndexes.splice(lastSelectionStart, 0, hoverIndexes[lastSelectionStart]);
                    } else {
                        hoverIndexes.splice(lastSelectionStart, 0, undefined);
                    }
                    //the same for click events
                    if(clickIndexes[lastSelectionStart] != undefined) {
                        clickIndexes.splice(lastSelectionStart, 0, clickIndexes[lastSelectionStart]);
                    } else {
                        clickIndexes.splice(lastSelectionStart, 0, undefined);
                    }
                    //the analogous for formatting
                    for(var f = 0; f < formatArray.length; f++) {
                        if(formatLock[f]) {
                            formatArray[f].splice(lastSelectionStart, 0, (formatValue[f]));
                        } else {
                            formatArray[f].splice(lastSelectionStart, 0, (formatArray[f][lastSelectionStart - 1]));
                        }
                        formatLock[f] = false;
                    }
                }


            }
        }

        function GarbageCollectArrays(_delete = false) {
            if(cursorArray.length > 1) {
                var previousColor = undefined;
                for(var i = 0; i < cursorArray.length; i++) {
                    if(cursorArray[i] == 0) {
                        console.log("Found empty string at " + i + " of " + cursorArray.length);
                        cursorArray.splice(i, 1);
                        colorArray.splice(i, 1);
                        inputArray.splice(i, 1);
                        if(!_delete && inputIndex > 0) {
                            inputIndex--;
                            console.log("Garbage Collection set InputIndex to " + inputIndex);
                        }
                    }

                    if(colorArray[i] == previousColor && colorArray[i] != undefined) {
                        //merge the 2 arrays
                        MergeArraySets(i); //will remove 1 array, so we need to decriment i
                        i--;
                    }
                    previousColor = colorArray[i];
                }
            }
        }

        //merges array set at index and index - 1 (which is garunteed to exist)
        function MergeArraySets(index) {
            console.log("Attempted merge on garbage collection");
            inputArray[index - 1] += inputArray[index];
            cursorArray[index - 1] += cursorArray[index];

            console.log("updated " + (index - 1) + ", deleted " + (index));

            inputArray.splice(index, 1);
            cursorArray.splice(index, 1);
            colorArray.splice(index, 1);
            startArray.splice(index, 1);
        }

        //complete for new hover event system
        function HandleHighlightDeletion(lengthDif) {
            var startIndex = 0;
            var endIndex = 0;
            var startInconsistent = lastSelectionStart;
            while(startInconsistent > 0) {
                startInconsistent -= cursorArray[startIndex];
                startIndex++;
            }
            startIndex--;

            var endInconsistent = lastSelectionEnd;
            while(endInconsistent > 0) {
                endInconsistent -= cursorArray[endIndex];
                endIndex++;
            }
            endIndex--;

            //handles the case where the user deletes everything via a highlight (CTRL A)
            if(startIndex < 0 && endIndex + 1 == inputArray.length) {
                var originalColor = colorArray[0];
                inputArray[0] = '';
                cursorArray[0] = 0;
                colorArray[0] = originalColor;
                startArray[0] = 0;                
                
                inputArray.splice(1, inputArray.length - 1);
                cursorArray.splice(1, cursorArray.length - 1);
                colorArray.splice(1, colorArray.length - 1);
                startArray.splice(1, startArray.length - 1);
                inputIndex = 0;
                DebugInputField();

                //clickEvent handle
                clickIndexes = new Array();
                clickEvent = new Array();

                //hoverEvent handle
                hoverIndexes = new Array();
                hoverEvent = new Array();

                //formatting Handle
                for(var f = 0; f < formatArray.length; f++) {
                    formatArray[f] = new Array();
                }
                return;
            }
            console.log("Found Start-End: [" + startIndex + ", " + endIndex + "]");
            
            //handles all the splicing for clickEvent and hvoerEvent deletion
            RemoveClickEvent();
            RemoveHoverEvent();
            //format handling for highlight deletion
            for(var f = 0; f < formatArray.length; f++) {
                formatArray[f].splice(lastSelectionStart, lastSelectionEnd - lastSelectionStart);
            }

            //at this point the start and end arrays have been identified
            if(startIndex == endIndex) {
                //we highlighted within the same string
                cursorArray[startIndex] += lengthDif;
                GarbageCollectArrays();
                console.log("HandleHighlightDeletion found color: " + colorArray[inputIndex]);
                ResetColorButtons(colorArray[inputIndex]);
            } else {
                var removedLength = 0;
                for(var i = startIndex; i <= endIndex; i++) {
                    if(i == startIndex) {
                        removedLength = inputArray[i].length;
                        inputArray[i] = inputArray[i].substring(0, lastSelectionStart - startArray[i]);
                        cursorArray[i] = inputArray[i].length;
                        console.log("Sub-exed the last part of string " + i + " from (0, " + lastSelectionStart  + "-" + startArray[i] + ") resulting in " + inputArray[i]);
                        removedLength -= inputArray[i].length;
                        console.log("Start Updated removedLength to " + removedLength);
                    } else if(i != endIndex) {
                        removedLength += inputArray[i].length;
                        console.log("Removed: " + inputArray[i]);
                        inputArray.splice(i, 1);
                        cursorArray.splice(i, 1);
                        startArray.splice(i, 1);
                        colorArray.splice(i, 1);
                        
                        endIndex--;
                        i--;
                    } else {
                        console.log("Sub-exed the beginning of string " + i + " from (" + lastSelectionEnd + "-" + startArray[i] + ", " + inputArray[i].length + ")");
                        inputArray[i] = inputArray[i].substring(lastSelectionEnd - startArray[i], inputArray[i].length);
                        removedLength += cursorArray[i] - inputArray[i].length;
                        cursorArray[i] = inputArray[i].length;
                        startArray[i] = lastSelectionEnd - removedLength;
                            
                        for(var j = i + 1; j < inputArray.length; j++) {
                            startArray[j] -= removedLength;
                        }
                    }
                }
            }

            lastSelectionStart = undefined;
            lastSelectionEnd = undefined;
            DebugInputField();
        }

        function UpdateinputIndex(event, lengthDif) {
            var currentPosition = event.target.selectionStart;
            var currentIndex = 0;
            GarbageCollectArrays();
            while(currentPosition > 0) {
                currentPosition -= cursorArray[currentIndex];
                currentIndex++;
            }
            inputIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            //console.log("InputIndex is now: " + inputIndex);
            if(!inputIndexColorLock) {
                console.log("UpdateInputIndex found color: " + colorArray[inputIndex] + " with index " + inputIndex);
                ResetColorButtons(colorArray[inputIndex]);
            }

            UpdateSelectionVars(event);
        }

        function HandleColorInsertion(event, lengthDif) {
            //startArray.splice(inputIndex, 0, )
            var position = event.target.selectionStart - lengthDif;
            console.log("You attempted a splice; position=" + position);
            if(position == 0) {
                startArray.splice(0, 0, 0);
                cursorArray.splice(0, 0, 0);
                inputArray.splice(0, 0, '');
                colorArray.splice(0, 0, document.getElementsByClassName("selected-color")[0].style.color);

                for(var i = 1; i < startArray.length; i++) {
                    startArray[i] += lengthDif;
                }
                
                inputIndex = 0;
            } else {
                var currentIndex = 0;
                var positionInconsistent = position;
                while(positionInconsistent > 0) {
                    positionInconsistent -= cursorArray[currentIndex];
                    currentIndex++;
                }
                currentIndex--; //at this point this is the index of the string we are splicing
                var startString = inputArray[currentIndex].substr(0, position - startArray[currentIndex]);
                var endString = inputArray[currentIndex].substring(position - startArray[currentIndex], inputArray[currentIndex].length);
                console.log("Spliced String: [" + startString + "][" + endString + "]");
                if(startString.length == 0) {
                    //SHOULD NEVER HAPPEN - NOT GARUNTEED TO WORK IF USED
                    console.log("Executed start of string color insertion");

                    //we are at the start of a string - 1 splice set
                    startArray.splice(currentIndex - 1, 0, position);
                    cursorArray.splice(currentIndex - 1, 0, 0);
                    inputArray.splice(currentIndex - 1, 0, '');
                    colorArray.splice(currentIndex - 1, 0, document.getElementsByClassName("selected-color")[0].style.color);
                    
                    inputIndex--;
                } else if(endString.length == 0) {
                    console.log("Exectued end of string color insertion");
                    //we are at the end of a string - 1 splice set
                    for(var i = currentIndex + 1; i < startArray.length; i++) {
                        startArray[i] += lengthDif;
                    }

                    startArray.splice(currentIndex + 1, 0, position);
                    cursorArray.splice(currentIndex + 1, 0, 0);
                    inputArray.splice(currentIndex + 1, 0, '');
                    colorArray.splice(currentIndex + 1, 0, document.getElementsByClassName("selected-color")[0].style.color);
                } else {
                    console.log("Executed middle of string color insertion");
                    
                    //we are in the middle of a string - 3 splice sets, 3 new array sets
                    inputArray[currentIndex] = startString;
                    cursorArray[currentIndex] = startString.length;

                    startArray.splice(currentIndex + 1, 0, position);
                    cursorArray.splice(currentIndex + 1, 0, 0);
                    inputArray.splice(currentIndex + 1, 0, '');
                    colorArray.splice(currentIndex + 1, 0, document.getElementsByClassName("selected-color")[0].style.color);

                    startArray.splice(currentIndex + 2, 0, position + lengthDif);
                    cursorArray.splice(currentIndex + 2, 0, endString.length);
                    inputArray.splice(currentIndex + 2, 0, endString);
                    colorArray.splice(currentIndex + 2, 0, colorArray[currentIndex]);

                    for(var i = currentIndex + 3; i < startArray.length; i++) {
                        startArray[i] += lengthDif;
                        console.log("Added lengthDiff to " + i);
                    }
                    
                }
                console.log("Spliced at inputIndex=" + currentIndex);
            }
        }

        function HandleColorHighlight() {
            var startInconsistent = lastSelectionStart;
            var startIndex = 0;
            while(startInconsistent > 0) {
                //console.log("Calculating Start Index: " + startInconsistent + " - " + cursorArray[startIndex] + " = " + (startInconsistent - cursorArray[startIndex]));
                startInconsistent -= cursorArray[startIndex];
                startIndex++;
            }
            if(startIndex != 0)
                startIndex--;
            var endInconsistent = lastSelectionEnd;
            var endIndex = 0;
            while(endInconsistent > 0) {
                //console.log("Calculating End Index: " + endInconsistent + " - " + cursorArray[endIndex] + " = " + (endInconsistent - cursorArray[endIndex]));
                endInconsistent -= cursorArray[endIndex];
                endIndex++;
            }
            endIndex--;

            console.log("Color Highlight: (" + startIndex + ", " + endIndex + ")");

            if(startIndex == endIndex) {
                //we are changing colors within the same string - 3 splice sets, 2 new array sets
                var beforeString = inputArray[startIndex].substring(0, lastSelectionStart - startArray[startIndex]);
                var middleString = inputArray[startIndex].substring(lastSelectionStart - startArray[startIndex], lastSelectionEnd - startArray[startIndex]);
                var afterString = inputArray[startIndex].substring(lastSelectionEnd - startArray[startIndex], inputArray[startIndex].length);
                //console.log("[" + beforeString + "][" + middleString + "][" + afterString + "]");

                inputArray[startIndex] = beforeString;
                cursorArray[startIndex] = beforeString.length;
                
                inputArray.splice(startIndex + 1, 0, middleString);
                cursorArray.splice(startIndex + 1, 0, middleString.length);
                startArray.splice(startIndex + 1, 0, lastSelectionStart);
                colorArray.splice(startIndex + 1, 0, document.getElementsByClassName("selected-color")[0].style.color);

                inputArray.splice(startIndex + 2, 0, afterString);
                cursorArray.splice(startIndex + 2, 0, afterString.length);
                startArray.splice(startIndex + 2, 0, lastSelectionEnd);
                colorArray.splice(startIndex + 2, 0, colorArray[startIndex]);
            } else {
                //loops through each colored string that this highlight selects
                for(var i = startIndex; i <= endIndex; i++) {
                    if(i == startIndex) {
                        var beforeString = inputArray[i].substring(0, lastSelectionStart - startArray[i]);
                        var afterString = inputArray[i].substring(lastSelectionStart - startArray[i], inputArray[i].length);
                        //console.log("Starting Index: [" + beforeString + "][" + afterString + "]");

                        inputArray[i] = beforeString;
                        cursorArray[i] = beforeString.length;

                        inputArray.splice(i + 1, 0, afterString);
                        cursorArray.splice(i + 1, 0, afterString.length);
                        startArray.splice(i + 1, 0, startArray[i] + cursorArray[i]);
                        colorArray.splice(i + 1, 0, document.getElementsByClassName("selected-color")[0].style.color);
                        endIndex++;
                        i++;
                    } else if(i != endIndex) {
                        //we are neither at the "start" of our highlighted indexes nor the "end", so our highlight completely covers these indexes
                        colorArray[i] = document.getElementsByClassName("selected-color")[0].style.color;
                    } else {
                        //we are at the final index that was included in our highlight
                        var beforeString = inputArray[i].substring(0, lastSelectionEnd - startArray[i]);
                        var afterString = inputArray[i].substring(lastSelectionEnd - startArray[i], inputArray[i].length);
                        var originalColor = colorArray[i];
                        //console.log("Ending Index: [" + beforeString + "][" + afterString + "] at i=" + i);

                        inputArray[i] = beforeString;
                        cursorArray[i] = beforeString.length;
                        colorArray[i] = document.getElementsByClassName("selected-color")[0].style.color;

                        inputArray.splice(i + 1, 0, afterString);
                        cursorArray.splice(i + 1, 0, afterString.length);
                        colorArray.splice(i + 1, 0, originalColor);
                        startArray.splice(i + 1, 0, startArray[i] + cursorArray[i]);
                    }
                }
            }
            window.getSelection().removeAllRanges(); //NOTE: May be incompatible with non-chromium or old versions of browsers - removes the highlight after the user clicks on a color, i.e. runs this function
            RecalculateOutput();
        }

        function ResetColorButtons(color) {
            console.log("Reset Color buttons with color " + color);
            document.getElementsByClassName("selected-color")[0].classList.remove("selected-color");
            var colorButtons = document.getElementsByClassName("color");
            for(var i = 0; i < colorButtons.length; i++) {
                if(colorButtons[i].getElementsByTagName("button")[0].style.color == color) {
                    colorButtons[i].classList.add("selected-color");
                }
            }
        }

        function AutoSizeInput(event) {
            event.target.style.height = (event.target.scrollHeight + 6) + 'px';
        }

        clickIndexes = new Array();
        clickEvent = new Array();

        hoverIndexes = new Array();        //indexes into the hoverEvent array, which stores all the hover events
        hoverEvent = new Array();          //houses all hoverEvents, never decreases in size, simply pushes more hover events onto the front, even if not referenced by the hoverIndexes

        function DebugClickEvents() {
            var output = "";
            var outputEvents = "";
            for(var i = 0; i < clickIndexes.length; i++) {
                if(clickIndexes[i] == undefined) {
                    output += "_, ";
                } else {
                    output += clickIndexes[i] + ", ";
                }
            }
            for(var i = 0; i < clickEvent.length; i++) {
                outputEvents += "[" + i + "]: " + clickEvent[i] + ", ";
            }
            console.log("Click Events:");
            console.log(output.substring(0, output.length - 2));
            console.log(outputEvents.substring(0, outputEvents.length - 2));
        }

        function DebugHoverEvents() {
            var output = "";
            var outputEvents = "";
            for(var i = 0; i < hoverIndexes.length; i++) {
                if(hoverIndexes[i] == undefined) {
                    output += "_, ";
                } else {
                    output += hoverIndexes[i] + ", ";
                }
            }
            for(var i = 0; i < hoverEvent.length; i++) {
                outputEvents += "[" + i + "]: " + hoverEvent[i] + ", ";
            }
            console.log("Hover Events:");
            console.log(output.substring(0, output.length - 2));
            console.log(outputEvents.substring(0, outputEvents.length - 2));
        }

        function AddClickEvent() {
            var clickInput = document.getElementById("click-event-input").value;
            if(clickInput.length == 0) {
                if(!confirm("Are you sure want to create a click event with no text?")) {
                    return;
                }
            }            
            if(inputArray[0] == '') {
                alert("Enter text to apply this click event to first. Click the underlined \"show explanation\" for more details.");
                return;
            }
            if(clickEvent[clickIndexes[lastSelectionStart]] != undefined && lastSelectionStart == lastSelectionEnd) {
                //there is already a click event here, replace it
                if(clickEvent[clickIndexes[lastSelectionStart]].localeCompare(clickInput) == 0) {
                    return; //skips if we are trying to add the same hvoer event to the same index repeatedly (a misclick). Helps reduce memory usage
                }
                var foundClickEventIndex = clickIndexes[lastSelectionStart];
                var clickEventStart = undefined;
                var clickEventEnd = undefined;
                var i = 1;
                while(clickIndexes[lastSelectionStart - i] == foundClickEventIndex) {
                    i++;
                }
                i--;
                clickEventStart = lastSelectionStart - i;
                i = 1;
                while(clickIndexes[lastSelectionStart + i] == foundClickEventIndex) {
                    i++;
                }
                i--;
                clickEventEnd = lastSelectionStart + i;

                for(var j = clickEventStart; j < clickEventEnd + 1; j++) {
                    clickIndexes[j] = clickEvent.length;
                }
                clickEvent.push(clickInput);
            } else if(lastSelectionStart == lastSelectionEnd) {
                //we have no highlight, and there is not an existing click event, use the color instead or until you hit the first event
                var clickEventStart = undefined;
                var clickEventEnd = undefined;
                
                var i = lastSelectionStart - 1;
                while(i > startArray[inputIndex]) {
                    if(clickIndexes[i] != undefined) {
                        i++;
                        break;
                    }
                    i--;
                }
                clickEventStart = i;
                i = lastSelectionStart + 1;
                while(i < (startArray[inputIndex] + cursorArray[inputIndex])) {
                    if(clickIndexes[i] != undefined) {
                        break;
                    }
                    i++;
                }
                i--;
                clickEventEnd = i;
                
                for(var j = clickEventStart; j < clickEventEnd + 1; j++) {
                    clickIndexes[j] = clickEvent.length;
                }
                clickEvent.push(clickInput);
            } else {
                //we have a highlight
                for(var j = lastSelectionStart; j < lastSelectionEnd; j++) {
                    clickIndexes[j] = clickEvent.length;
                }
                clickEvent.push(clickInput);
            }
            //DebugClickEvents();
            RecalculateOutput();
        }

        function RemoveClickEvent() {
            if(clickEvent[clickIndexes[lastSelectionStart]] != undefined && lastSelectionStart == lastSelectionEnd) {
                //there is already a click event here and we are not highlighting
                var foundClickEventIndex = clickIndexes[lastSelectionStart];
                var clickEventStart = undefined;
                var clickEventEnd = undefined;
                var i = 1;
                while(clickIndexes[lastSelectionStart - i] == foundClickEventIndex) {
                    i++;
                }
                i--;
                clickEventStart = lastSelectionStart - i;
                i = 1;
                while(clickIndexes[lastSelectionStart + i] == foundClickEventIndex) {
                    i++;
                }
                i--;
                clickEventEnd = lastSelectionStart + i;

                for(var j = clickEventStart; j < clickEventEnd + 1; j++) {
                    clickIndexes[j] = undefined;
                }
                //for simplicity, clickEvent's unused text is not removed (we shouldn't be putting too too much text in these things anyways)
            } else if(lastSelectionStart != lastSelectionEnd) {
                //we have a highlight
                for(var j = lastSelectionStart; j < lastSelectionEnd; j++) {
                    clickIndexes[j] = undefined;
                }
                //for simplicity, clickEvent's unused text is not removed (we shouldn't be putting too too much text in these things anyways)
            }
            RecalculateOutput();
            //DebugClickEvents();
        }

        function ClickNotification(value) {
            console.log("Called Click Notif");
            if(value) {
                //on
                document.getElementById("click-notification-box").innerHTML += '<p id="click-notification" style="color: #a9a9a9;">This text conatins a click event</p>';
                if(document.getElementById("click-notification-box").childElementCount > 1) {
                    document.getElementById("click-notification-box").children[0].remove();
                }
            } else {
                //off
                document.getElementById("click-notification-box").children[0].remove();
                while(document.getElementById("click-notification-box").childElementCount > 0) {
                    document.getElementById("click-notification-box").children[0].remove();
                }
            }
        }

        function ClickPreview(command) {
            document.getElementById("click-notification").innerHTML += " | Executed Command: <span style=\"color: white;\">" + command + "</span>";
        }

        function AddHoverEvent() {
            var hoverInput = document.getElementById("hover-event-input").value;
            if(hoverInput.length == 0) {
                if(!confirm("Are you sure want to create a hover event with no text?")) {
                    return;
                }
            }
            if(inputArray[0] == '') {
                alert("Enter text to apply this hover event to first. Click the underlined \"show explanation\" for more details.");
                return;
            }
            if(hoverEvent[hoverIndexes[lastSelectionStart]] != undefined && lastSelectionStart == lastSelectionEnd) {
                //there is already a hover event here, replace it
                if(hoverEvent[hoverIndexes[lastSelectionStart]].localeCompare(hoverInput) == 0) {
                    return; //skips if we are trying to add the same hvoer event to the same index repeatedly (a misclick). Helps reduce memory usage
                }
                var foundHoverEventIndex = hoverIndexes[lastSelectionStart];
                var hoverEventStart = undefined;
                var hoverEventEnd = undefined;
                var i = 1;
                while(hoverIndexes[lastSelectionStart - i] == foundHoverEventIndex) {
                    i++;
                }
                i--;
                hoverEventStart = lastSelectionStart - i;
                i = 1;
                while(hoverIndexes[lastSelectionStart + i] == foundHoverEventIndex) {
                    i++;
                }
                i--;
                hoverEventEnd = lastSelectionStart + i;

                for(var j = hoverEventStart; j < hoverEventEnd + 1; j++) {
                    hoverIndexes[j] = hoverEvent.length;
                }
                hoverEvent.push(hoverInput);
            } else if(lastSelectionStart == lastSelectionEnd) {
                //we have no highlight, and there is not an existing hover event, use the color instead or until you hit the first event
                var hoverEventStart = undefined;
                var hoverEventEnd = undefined;
                
                var i = lastSelectionStart - 1;
                while(i > startArray[inputIndex]) {
                    if(hoverIndexes[i] != undefined) {
                        i++;
                        break;
                    }
                    i--;
                }
                hoverEventStart = i;
                i = lastSelectionStart + 1;
                while(i < (startArray[inputIndex] + cursorArray[inputIndex])) {
                    if(hoverIndexes[i] != undefined) {
                        break;
                    }
                    i++;
                }
                i--;
                hoverEventEnd = i;
                
                for(var j = hoverEventStart; j < hoverEventEnd + 1; j++) {
                    hoverIndexes[j] = hoverEvent.length;
                }
                hoverEvent.push(hoverInput);
            } else {
                //we have a highlight
                for(var j = lastSelectionStart; j < lastSelectionEnd; j++) {
                    hoverIndexes[j] = hoverEvent.length;
                }
                hoverEvent.push(hoverInput);
            }
            //DebugHoverEvents();
            RecalculateOutput();
        }

        function RemoveHoverEvent() {
            if(hoverEvent[hoverIndexes[lastSelectionStart]] != undefined && lastSelectionStart == lastSelectionEnd) {
                //there is already a hover event here and we are not highlighting
                var foundHoverEventIndex = hoverIndexes[lastSelectionStart];
                var hoverEventStart = undefined;
                var hoverEventEnd = undefined;
                var i = 1;
                while(hoverIndexes[lastSelectionStart - i] == foundHoverEventIndex) {
                    i++;
                }
                i--;
                hoverEventStart = lastSelectionStart - i;
                i = 1;
                while(hoverIndexes[lastSelectionStart + i] == foundHoverEventIndex) {
                    i++;
                }
                i--;
                hoverEventEnd = lastSelectionStart + i;

                for(var j = hoverEventStart; j < hoverEventEnd + 1; j++) {
                    hoverIndexes[j] = undefined;
                }
                //for simplicity, hoverEvent's unused text is not removed (we shouldn't be putting too too much text in these things anyways)
            } else if(lastSelectionStart != lastSelectionEnd) {
                //we have a highlight
                for(var j = lastSelectionStart; j < lastSelectionEnd; j++) {
                    hoverIndexes[j] = undefined;
                }
                //for simplicity, hoverEvent's unused text is not removed (we shouldn't be putting too too much text in these things anyways)
            }
            RecalculateOutput();
            //DebugHoverEvents();
        }

        function HoverNotification(value, hoverValue, event) {
            if(value) {
                var offsetY = -50 + window.scrollY;
                var offsetX = 30;
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                //console.log(mouseX + ", " + mouseY);
                if(document.getElementById("hover-notification")) {
                    document.getElementById("hover-notification").style.top = mouseY + offsetY;
                    document.getElementById("hover-notification").style.left = mouseX + offsetX;
                } else {
                    event.target.parentElement.innerHTML += '<div id="hover-notification" style="background-color: black; padding: 3px; border-radius: 7px; color: white; font-family: Courier, monospace; font-size: 30px; position: absolute; top: ' + (mouseY + offsetY) + '; left: ' + (mouseX + offsetX) + ';"><div style="border: 3px solid #38177b; border-radius: 5px; padding: inherit">' + hoverValue + '</div></div>';
                }
            } else {
                try {
                    document.getElementById("hover-notification").remove();
                } catch(e) {
                    //deliberately nothing
                }
            }
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

        function HighlightHoverEvents() {
            var hoverEvents = document.getElementsByClassName("hover-event");
            if(document.getElementById("hover-checkbox").checked) {
                for(var i = 0; i < hoverEvents.length; i++) {
                    hoverEvents[i].style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
                    if(document.getElementById("click-checkbox").checked && hoverEvents[i].classList.contains('click-event')) {
                        hoverEvents[i].style.backgroundColor = 'rgba(0, 127, 0, 0.5)';
                    }
                }
            } else {
                for(var i = 0; i < hoverEvents.length; i++) {
                    hoverEvents[i].style.backgroundColor = 'rgba(255, 255, 0, 0)';
                }
                if(document.getElementById("click-checkbox").checked) {
                    HighlightClickEvents();
                }
            }
        }

        function HighlightClickEvents() {
            var clickEvents = document.getElementsByClassName("click-event");
            if(document.getElementById("click-checkbox").checked) {
                for(var i = 0; i < clickEvents.length; i++) {
                    clickEvents[i].style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
                    if(document.getElementById("hover-checkbox").checked && clickEvents[i].classList.contains('hover-event')) {
                        clickEvents[i].style.backgroundColor = 'rgba(0, 127, 0, 0.5)';
                    }
                }
            } else {
                for(var i = 0; i < clickEvents.length; i++) {
                    clickEvents[i].style.backgroundColor = 'rgba(0, 0, 255, 0)';
                }
                if(document.getElementById("hover-checkbox").checked) {
                    HighlightHoverEvents();
                }
            }
        }

        function ClearFormatting(event) {
            event.target.blur();

            var formats = document.getElementsByClassName("formatting");
            for(var i = 0; i < formats.length; i++) {
                if(formats[i].classList.contains("selected-format"))
                    formats[i].classList.remove("selected-format");
            }

            if(!event.target.parentElement.classList.contains('selected-format'))
                event.target.parentElement.classList.add('selected-format');
            
            //                                                                                                                                      TODO: Handle Backend
        }

        function AddFormat(event, format) {
            var value;
            var parent = event.target.parentElement;
            if(parent.classList.length == 0) {
                parent = parent.parentElement;
            }
            parent.children[0].blur();
            console.log(!parent.classList.contains('selected-format') + " , " + parent.classList);
            if(!parent.classList.contains('selected-format')) {
                parent.classList.add('selected-format');
                value = true;
                if(document.getElementsByClassName("formatting")[0].classList.contains('selected-format'))
                    document.getElementsByClassName("formatting")[0].classList.remove('selected-format');
            } else {
                parent.classList.remove('selected-format');
                value = false;
                if(document.getElementsByClassName("selected-format")[0] == undefined)
                document.getElementsByClassName("formatting")[0].classList.add('selected-format');
            }

            AddFormatBackend(format, value);
        }

        var boldIndexes = new Array();
        var italicIndexes = new Array();
        var underlineIndexes = new Array();
        var strikethroughIndexes = new Array();
        var obfuscatedIndexes = new Array();
        var enchantedIndexes = new Array();
        var formatArray = new Array();

        var formatLock = new Array();
        var formatValue = new Array();

        function AddFormatBackend(format, value) {
            if(lastSelectionEnd == lastSelectionStart) {
                //we do not have a highlight and will be inserting
                console.log("Locked Formats (Pre): " + formatLock);     //Helps make it act like word
                formatLock[format] = true;
                formatValue[format] = value;
                console.log("Locked Formats: " + formatLock);
                
            } else if(lastSelectionStart == 0 && lastSelectionEnd == document.getElementById('input').value.length) {
                //we have higlighted the entire text
                console.log("Detected Full Highlight");
                for(var i = 0; i < formatArray[format].length; i++) {
                    if(formatArray[format][i]) {
                        formatArray[format][i] = false;
                    } else {
                        formatArray[format][i] = true;
                        //console.log("Added to formatArray: " + formatArray[format][j]);
                    }
                }
            } else {
                //we have a highlight
                for(var j = lastSelectionStart; j < lastSelectionEnd; j++) {
                    if(formatArray[format][j]) {
                        formatArray[format][j] = false;
                    } else {
                        formatArray[format][j] = true;
                        console.log("Added to formatArray: " + formatArray[format][j]);
                    }
                }
            }
            DebugFormatting();
            RecalculateOutput();
        }

        function DebugFormatting() {
            var outputString = '';
            for(var i = 0; i < formatArray.length; i++) {
                outputString += "[" + formatDict[i].substring(0, 3) + "]: ";
                for(var j = 0; j < formatArray[i].length; j++) {
                    if(formatArray[i][j]) {
                        outputString += "|";
                    } else {
                        outputString += ".";
                    }
                }
                outputString += "\n";
            }
            console.log(outputString);
        }

        var expToggles = new Array();

        function ToggleExp(id) {
            while(id >= expToggles.length) {
                expToggles.push(false);
                console.log("added false");
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
                console.log("added false");
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