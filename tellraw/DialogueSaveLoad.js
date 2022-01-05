function Save() {
    document.getElementById("save-loading").style.display = "inline";
    let aPromise = function aPromiseFunc(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var code = JSON.stringify(DiaToJSON(dialogue));
                var blob = new Blob([code], {type: "application/json"});
                var autoLink = document.createElement("a");
                let name = prompt("Save this dialogue project as:", Date().replaceAll(' ', '').substring(3, 12));
                while(name.indexOf(".") != -1 || name.indexOf("/") != -1) {
                    name = prompt("The name you entered is not a valid file name.\nSave this dialogue project as:", Date().replaceAll(' ', '').substring(3, 12));
                }
                autoLink.download = name + ".json";
                
                autoLink.href = window.URL.createObjectURL(blob);
                autoLink.click();
            
                resolve();
            }, 100);
        });
    };
    aPromise().then(() => {
        document.getElementById("save-loading").style.display = "none";
        alert("Saved to your default (downloads) folder.");
    });
}

var importFile;
function FileUpdater(event) {
    importFile = event.target.files[0].text().then((data) => {
        dialogue = JSONToDia(JSON.parse(data));
        RefreshMainWindow();
    }).catch((e) => {
        alert("The file you entered could not be read properly. Ensure you are importing the proper JSON.");
    });
}