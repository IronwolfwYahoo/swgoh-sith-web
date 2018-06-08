var members = [];
var characters = [];
var tabledata;

function initPage(){
    debug = true;
    log('initPage called');
    getJSONData("members");
    getJSONData("characters");
    var body = document.getElementById("pageBody");
    body.appendChild(createElement('div', "interim_1", "sectionHeader", "LOADING..."));
    body.appendChild(createElement('div', "interim_2", 'loader'));
}

function jsonListener() {
    try {
        var json;
        tabledata = this.responseText;
        json = JSON.parse(tabledata);
        if(json.type == 'members'){
            if(json.data == undefined)
                throw("Member List was not Retrieved");
            members = json.data;
            if(document.getElementById("interim_1") != null && members.length > 0 && characters.length > 0)
                buildPageContent();
        }
        else if(json.type == 'characters'){
            if(json.data == undefined)
                throw("Character List was not Retrieved");
            characters = json.data;
            if(document.getElementById("interim_1") != null && members.length > 0 && characters.length > 0)
                buildPageContent();
        }
        else if(json.type == 'buildGearList'){
            if(json.data == undefined)
                throw("Gear List was not Retrieved");
            buildGearTables(json.data)
        }
        else if(json.type == 'Error'){
            displayError(json.data)
        }
    } catch(err){
        try {
            var int1 = document.getElementById("interim_1");
            var int2 = document.getElementById("interim_2");
            int1.parentNode.removeChild(int1);
            int2.parentNode.removeChild(int2);
        } catch (err){}
        
        var body = document.getElementById("pageBody");
        var section = createElement('div', 'gearTableSection', 'section');
        section.appendChild(createElement('div', undefined, 'sectionHeader', "An error occured"));
        var sectionContent = createElement('div', undefined, 'sectionContent', "<p>Error Message: </p>"+err);
        section.appendChild(sectionContent);
        body.appendChild(section);
    }
}

function findGear(){
    var member = document.getElementById("member");
    var character = document.getElementById("character");
    
    var gTS = document.getElementById("gearTableSection");
    try {gTS.parentNode.removeChild(gTS);} catch (err){}

    var body = document.getElementById("pageBody");
    body.appendChild(createElement('div', "interim_1", "sectionHeader", "Retrieving Gear from SWGoH.gg"));
    body.appendChild(createElement('div', "interim_2", 'loader'));

    getJSONData("buildGearList", [["member", member.value],["character", character.value]]);
    //jsonListener();
}

function saveToExcel(){
    window.open('http://sithhappens.net/swgoh/saveToExcel', '_blank');
}

function displayError (data) {
    log('displayError() - called');
        var int1 = document.getElementById("interim_1");
        var int2 = document.getElementById("interim_2");
        int1.parentNode.removeChild(int1);
        int2.parentNode.removeChild(int2);
        
        var body = document.getElementById("pageBody");
        var section = createElement('div', 'gearTableSection', 'section');
        section.appendChild(createElement('div', undefined, 'sectionHeader', "An error occured"));
        var sectionContent = createElement('div', undefined, 'sectionContent', "<p>Error Message: </p>"+data[0]);
        section.appendChild(sectionContent);
        body.appendChild(section);
}

function buildPageContent () {
    log('buildPageContent() - called');
    var int1 = document.getElementById("interim_1");
    var int2 = document.getElementById("interim_2");
    int1.parentNode.removeChild(int1);
    int2.parentNode.removeChild(int2);

    var body = document.getElementById("pageBody");

    var section = createElement('div', undefined, 'section');
    section.appendChild(createElement('div', undefined, 'sectionHeader', "Select your Name and the Character you want to Gear"));
    var sectionContent = createElement('div', undefined, 'sectionContent');
    
    var table = createElement('table');
    var trHeader = createElement('tr');
    var thMember = createElement('th', undefined, undefined, 'Select Member');
    var thCharacter = createElement('th', undefined, undefined, 'Select Character');
    var thBlank = createElement('th');
    trHeader.appendChild(thMember); trHeader.appendChild(thCharacter); trHeader.appendChild(thBlank);
    table.appendChild(trHeader);
    
    var tr = createElement('tr');
    var tdMember = createElement('td');
    var tdCharacter = createElement('td');
    var tdButton = createElement('td');

    var memberSelect = createElement('select', 'member');
    for(var i=0;i<members.length;i++){
        var option = createElement('option', undefined, undefined, members[i][0]);
        option.setAttribute('value', members[i][1]);
        memberSelect.appendChild(option);
    }
    tdMember.appendChild(memberSelect);
    tr.appendChild(tdMember);

    var characterSelect = createElement('select', 'character');
    for(var i=0;i<characters.length;i++){
        var option = createElement('option', undefined, undefined, characters[i][0]);
        option.setAttribute('value', characters[i][1]);
        characterSelect.appendChild(option);
    }
    tdCharacter.appendChild(characterSelect);
    tr.appendChild(tdCharacter);
    
    var findButton = createElement('input', 'findButton');
    findButton.setAttribute('type', 'button');
    findButton.setAttribute('onClick', 'findGear()');
    findButton.setAttribute('value', 'Find the Gear');
    tdButton.appendChild(findButton);
    tr.appendChild(tdButton);
    
    table.appendChild(tr);
    sectionContent.appendChild(table);
    
    section.appendChild(sectionContent);
    body.appendChild(section);
}

function buildGearTables (data) {
    log('buildPageContent() - called');
    var int1 = document.getElementById("interim_1");
    var int2 = document.getElementById("interim_2");
    int1.parentNode.removeChild(int1);
    int2.parentNode.removeChild(int2);
    
    var body = document.getElementById("pageBody");
    var charSelect = document.getElementById("character");
    var char = charSelect[charSelect.selectedIndex].innerHTML;

    var section = createElement('div', 'gearTableSection', 'section');
    section.appendChild(createElement('div', undefined, 'sectionHeader', char+"'s Gear has been Retrieved"));
    var sectionContent = createElement('div', undefined, 'sectionContent');
    try {
        if(document.getElementById('saveToExcelButton') == undefined){
            var saveToExcelButton = createElement('input', 'saveToExcelButton');
            saveToExcelButton.setAttribute('type', 'button');
            saveToExcelButton.setAttribute('onClick', 'saveToExcel()');
            saveToExcelButton.setAttribute('value', 'Save as Excel');
            findButton.parentNode.appendChild(saveToExcelButton);
            sectionContent.appendChild(saveToExcelButton);
        }
    } catch(err){
        debug = true;
        log("Error occured building the by piece table "+err);
        debug = false;
    }
    section.appendChild(sectionContent);
    body.appendChild(section);
}