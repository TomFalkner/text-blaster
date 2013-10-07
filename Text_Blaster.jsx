#targetengine TEXTBLASTER
/*
   The TEXT BLASTER

   WHAT IT'S SUPPOSED TO DO: This script will read a text file, store the contents, and Place lines into
   the job - either in a text frame or by replacing selected text. Companion file blastit.jsx allows
   keyboard shortcut to be used to place text in job.

REASON: Copy & Paste by hand is slow and boring.

Companion scripts 

*/

var myDoc = app.activeDocument;
//myText variable will hold contents of text file - each index corresponds to a line from the file
var myText = new Array;
var myTextCount = 0;

/////////BUILD THE DIALOG

var dlg = new Window('palette', 'Text Blaster');

dlg.frameLocation = [850, 150];
dlg.size = {width:330, height:175};

dlg.mainPnl = dlg.add('panel', [10,10,320,165]);
dlg.previewTxt = dlg.mainPnl.add('edittext', [5,5, 300, 90], undefined, {multiline:true});
dlg.previewTxt.readonly = true;
dlg.blastButton = dlg.mainPnl.add('button', [5, 100, 70, 115], 'Place');
dlg.backButton = dlg.mainPnl.add('button', [80, 100, 145, 115], 'Back');
dlg.nextButton = dlg.mainPnl.add('button', [155, 100, 225, 115], 'Next');
dlg.loadButton = dlg.mainPnl.add('button', [230, 100, 295, 115], 'Load'); 
dlg.plusReturn = dlg.mainPnl.add('checkbox', [5, 130, 50, 145]);
dlg.plusReturnLabel = dlg.mainPnl.add('statictext', [25, 130, 120, 145], 'Return');
dlg.upperCaseButton = dlg.mainPnl.add('button', [80, 125, 145, 130], 'Upper');
dlg.lowerCaseButton = dlg.mainPnl.add('button', [155, 125, 225, 130], 'Lower');
dlg.titleCaseButton = dlg.mainPnl.add('button', [230, 125, 295, 130], 'Title');


//EVENT LISTENTERS

dlg.loadButton.addEventListener('click', getFile);
dlg.nextButton.addEventListener('click', goToNext);
dlg.backButton.addEventListener('click', goBack);
dlg.blastButton.addEventListener('click', blastText);
dlg.upperCaseButton.addEventListener('click', toUpperCase);
dlg.lowerCaseButton.addEventListener('click', toLowerCase);
dlg.titleCaseButton.addEventListener('click', toTitleCase);

dlg.show();



//FUNCTIONS

function getFile(){
    //getFile loads a text file and set the preview box to the first line.
    //Clear the array of any previously loaded info.....
    myText = [];

    var myFile = File.openDialog("Where's your file?", filter, false);
    if (myFile != null && myFile.exists){
        myFile.open('r');
        while(!myFile.eof){
            var currentLine = myFile.readln();
            if(currentLine != ""){
                myText.push(currentLine);
            }
        }
        myFile.close();
        dlg.previewTxt.text = myText[0];
    }else{

    }
}

function filter(file) { 
    ///Utility function for getFile to make sure no one sneaks a .doc or .jpg in
    var myMatch = file.name.match(/\.txt$/i) != null; 
    if(myMatch){
        return myMatch;
    }else if(file.constructor.name == "Folder"){
        return true;
    }else{
        return false;
    }
} 

function goToNext(){
    if(myText.length > 0){
        myText[myTextCount] = dlg.previewTxt.text;
        myTextCount++;
        if(myTextCount >= myText.length){
            myTextCount = 0;
            dlg.previewTxt.text = myText[0];
        }else{
            dlg.previewTxt.text = myText[myTextCount];
        }
    }
}

function goBack(){
    if(myText.length>0){	
        myText[myTextCount] = dlg.previewTxt.text;
        myTextCount--;
        if(myTextCount < 0){
            myTextCount = myText.length-1;
            dlg.previewTxt.text = myText[myTextCount];
        }else{
            dlg.previewTxt.text = myText[myTextCount];
        }
    }
}
function blastText(){
    ///This function checks to see if text or a text box has been selected. Calls myInsertText to place copy
    if(app.documents.length != 0){
        if(app.selection.length ==1){
            switch (app.selection[0].constructor.name){
                case "InsertionPoint":
                    case "Character":
                    case "Word":
                    case "TextStyleRange":
                    case "Line":
                    case "Paragraph":
                    case "TextColumn":
                    case "Text":
                    case "Story":
                    //Object is a text object, pass it to function
                    myInsertText(app.selection[0]);
                break;
                case "TextFrame":
                    myInsertText(app.selection[0].texts.item(0));
                break;
                default:
                    alert("Oh no, you didn't select any text!");
                break;
            }
        }
    }
}
function myInsertText(myTextObject){
    // This function adds/replaces the text & 
    ///advances the myText array by one (updating the preview)
    if (dlg.plusReturn.value){
        myTextObject.contents = dlg.previewTxt.text + "\r";
    }else{
        myTextObject.contents = dlg.previewTxt.text;
    }
    myTextCount++;
    if(myTextCount >= myText.length){
        myTextCount = 0;
    }

    dlg.previewTxt.text = myText[myTextCount];

}
function toUpperCase(){
    if(dlg.previewTxt.text != ""){
        var myUpperTempText = myText[myTextCount].toUpperCase();
        dlg.previewTxt.text = myUpperTempText;
    }
}
function toLowerCase(){
    if(dlg.previewTxt.text != ""){
        var myLowerTempText = myText[myTextCount].toLowerCase();
        dlg.previewTxt.text = myLowerTempText;
    }
}
function toTitleCase(){
    if(dlg.previewTxt.text != ""){
        var myTitleTempText = processTitleCase(myText[myTextCount]);
        dlg.previewTxt.text = myTitleTempText;

    }
}
function processTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
