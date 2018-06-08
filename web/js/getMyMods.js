var OnePercentDmg = [];

function initPage(){
    log('initPage called');
    //var body = document.getElementById("getMyModsBody");
}

function populateFilters(){
    var guildNames = [];
    var table = document.getElementById('memberTableBody');
    for (var i = 0, row; row = table.rows[i]; i++) {
        var guildNameCell = row.cells[1];
        if(!contains(guildNameCell.innerHTML, guildNames)){
            guildNames.push(guildNameCell.innerHTML);
        }
    }
    for(i = 0; i<guildNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', guildNames[i]);
        option.innerHTML = guildNames[i];
        if(guild && guild == guildNames[i]){
            option.selected = true;
        }
        document.getElementById('guildName-input').appendChild(option);
    }
    updateMemberList();
}

function updateMemberList(){
    var memberEntries = [["None", "None"]];
    var guild = escapeSingleQuote(document.getElementById('guildName-input').value);
    var table = document.getElementById('memberTableBody');
    
    // Build the memberEntries array for populating the list
    for (var i = 0, row; row = table.rows[i]; i++) {
        // memberEntry = [MemberName, MemberURI];
        var memberEntry = [row.cells[0].innerHTML, row.cells[2].innerHTML];
        if(row.cells[1].innerHTML == guild && !contains(memberEntry, memberEntries)){
            memberEntries.push(memberEntry);
        }
    }
    // Update the memberName portion of the memberEntries array to distinguish duplicates
    for (var i = 0; i < memberEntries.length; i++) {
        var name = memberEntries[i][0];
        while (findMemberNameIndex(i, name, memberEntries) != -1){
            if(memberEntries[i][0] == name){
                memberEntries[i][0] = name+':'+memberEntries[i][1]; //Update the entry we're searching from if it's not already updated
            }
            var dupe = findMemberNameIndex(i, name, memberEntries);
            memberEntries[dupe][0] = name+':'+memberEntries[dupe][1]; // Update the entry we found
        }
    }
    
    // Populate the select element
    while (document.getElementById('MemberName-input').firstChild) {
        document.getElementById('MemberName-input').removeChild(document.getElementById('MemberName-input').firstChild);
    }
    for(var i = 0; i<memberEntries.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', memberEntries[i][1]);
        option.innerHTML = memberEntries[i][0];
        if(member && (member == decodeURIComponent(memberEntries[i][1]) || member == decodeURIComponent(memberEntries[i][0]))){
            option.selected = true;
        }
        document.getElementById('MemberName-input').appendChild(option);
    }
    refreshReportTable();
}

function findMemberNameIndex(i, val, array){
    i++;
    for(i; i < array.length;i++){
        if(array[i][0] == val){
            return i;
        }
    }
    return -1;
}

/*
 * range = array of ranges to pull from
 * listener = the listener for this request
 */
function getSheetContent (range, listener) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", listener);
    
    /*
var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
xmlhttp.open("POST", "/json-handler");
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.send(JSON.stringify({ email: "hello@user.com", response: { name: "Tester" } }));
     */

    // Determine the URL to send
    var url = "https://sheets.googleapis.com/v4/spreadsheets/1t_HLyLob19eEkQJ-6s5QfYvQvKm2QK6dnDV01zAC7fY/values";
    var key = "&key=AIzaSyDikzvbbIgMb2NQf5EBFoUSm8LzB5emnE4";
    if(range.length > 1 ){
        url += ":batchGet?ranges="+range[0];
        for(var i=1;i<range.length;i++){
            url += "&ranges="+range[i];
        }
    } else {
        url += "/"+range[0]+"?"
    }
    url += key;

    // Send the request
    oReq.open("GET", url);
    oReq.send();
}
function getOnePercentDmgNumbers () {
    log('getOnePercentDmgNumbers() - called');
    var ssData = (JSON.parse(this.responseText)).valueRanges;
    for(var i=0;i<6;i++){
        log("Adding "+ssData[i].values[0][0]+" to OnePercentDmg Numbers");
        OnePercentDmg[i] = (ssData[i].values[0][0].replace(",", ""))*1;
    }
    buildPageContent();
}

function buildPageContent () {
    log('buildPageContent() - called');
    var int1 = document.getElementById("interim_1");
    var int2 = document.getElementById("interim_2");
    int1.parentNode.removeChild(int1);
    int2.parentNode.removeChild(int2);

    for(var i = 0; i<4;i++){
        if(i != 3){
            var temp = section(i+1, OnePercentDmg[i]);
            temp.addToPage();
        } else {
            var temp = section(i+1, [OnePercentDmg[i], OnePercentDmg[i+1], OnePercentDmg[i+2]]);
            temp.addToPage();
        }
    }
}

function section(id, modifier){
    if (!(this instanceof section))
        return new section(id, modifier)
    this.id = id;
    if(id != 4)
        this.total = formatDmgNum(100*modifier);
    else
        this.total = [formatDmgNum(100*modifier[0]), formatDmgNum(100*modifier[1]), formatDmgNum(100*modifier[2])];
}
// createElement(elementType, id, clazz, html)
section.prototype.addToPage = function(){
    var body = document.getElementById("getMyModsBody");
    var secObj = createElement('div', undefined, 'section');
    secObj.appendChild(createElement('div', undefined, 'sectionHeader', "P"+this.id+" Damage Estimator"));
    
    var headtr = createElement('tr');
    if(this.id == 4)
        headtr.appendChild(createElement('th', undefined, undefined, ""));
    headtr.appendChild(createElement('th', undefined, undefined, "Start %"));
    headtr.appendChild(createElement('th', undefined, undefined, "End %"));
    headtr.appendChild(createElement('th', undefined, undefined, "Dmg Done"));

    var table = createElement('table');
    table.appendChild(headtr);
    
    var calctr = createElement('tr');
    if(this.id == 4)
        calctr.appendChild(createElement('td', undefined, undefined, "Nihilus"));
    var std = createElement('td');
    var ps = createElement('input', 'p'+this.id+'s');
    ps.setAttribute('type', 'number'); ps.setAttribute('style', 'width:35px');
    ps.setAttribute('onkeyup', "numCheck('p"+this.id+"s')"); ps.setAttribute('onblur', "numCheck('p"+this.id+"s')");
    std.appendChild(ps);
    calctr.appendChild(std);
    var etd = createElement('td');
    var pe = createElement('input', 'p'+this.id+'e');
    pe.setAttribute('type', 'number'); pe.setAttribute('style', 'width:35px');
    pe.setAttribute('onkeyup', "numCheck('p"+this.id+"e')"); pe.setAttribute('onblur', "numCheck('p"+this.id+"e')");
    etd.appendChild(pe);
    calctr.appendChild(etd);
    if(this.id == 4)
        calctr.appendChild(createElement('td', 'p'+this.id+'dmg', undefined, "0"));
    else
        calctr.appendChild(createElement('td', 'p'+this.id+'dmg', undefined, "0"));
    table.appendChild(calctr);
    if(this.id == 4){
        var calctr2 = createElement('tr');
        calctr2.appendChild(createElement('td', undefined, undefined, "Sion"));
        var std2 = createElement('td');
        var ps2 = createElement('input', 'p'+(this.id+1)+'s');
        ps2.setAttribute('type', 'number'); ps2.setAttribute('style', 'width:35px');
        ps2.setAttribute('onkeyup', "numCheck('p"+(this.id+1)+"s')"); ps2.setAttribute('onblur', "numCheck('p"+(this.id+1)+"s')");
        std2.appendChild(ps2);
        calctr2.appendChild(std2);
        var etd2 = createElement('td');
        var pe2 = createElement('input', 'p'+(this.id+1)+'e');
        pe2.setAttribute('type', 'number'); pe2.setAttribute('style', 'width:35px');
        pe2.setAttribute('onkeyup', "numCheck('p"+(this.id+1)+"e')"); pe2.setAttribute('onblur', "numCheck('p"+(this.id+1)+"e')");
        etd2.appendChild(pe2);
        calctr2.appendChild(etd2);
        calctr2.appendChild(createElement('td', 'p'+(this.id+1)+'dmg', undefined, "0"));
        table.appendChild(calctr2);

        var calctr3 = createElement('tr');
        calctr3.appendChild(createElement('td', undefined, undefined, "Traya"));
        var std3 = createElement('td');
        var ps3 = createElement('input', 'p'+(this.id+2)+'s');
        ps3.setAttribute('type', 'number'); ps3.setAttribute('style', 'width:35px');
        ps3.setAttribute('onkeyup', "numCheck('p"+(this.id+2)+"s')"); ps3.setAttribute('onblur', "numCheck('p"+(this.id+2)+"s')");
        std3.appendChild(ps3);
        calctr3.appendChild(std3);
        var etd3 = createElement('td');
        var pe3 = createElement('input', 'p'+(this.id+2)+'e');
        pe3.setAttribute('type', 'number'); pe3.setAttribute('style', 'width:35px');
        pe3.setAttribute('onkeyup', "numCheck('p"+(this.id+2)+"e')"); pe3.setAttribute('onblur', "numCheck('p"+(this.id+2)+"e')");
        etd3.appendChild(pe3);
        calctr3.appendChild(etd3);
        calctr3.appendChild(createElement('td', 'p'+(this.id+2)+'dmg', undefined, "0"));
        table.appendChild(calctr3);
        
        var calctr4 = createElement('tr');
        var std4 = createElement('td', undefined, undefined, "Total");
        std4.setAttribute('colspan', '3');
        calctr4.appendChild(std4);
        var etd4 = createElement('td', 'p4total');
        calctr4.appendChild(etd4);
        table.appendChild(calctr4);
    }
      
    var secContent = createElement('div', undefined, 'sectionContent');
    secContent.appendChild(table);
    secObj.appendChild(secContent);
    body.appendChild(secObj);
}