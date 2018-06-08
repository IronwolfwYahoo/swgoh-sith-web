// <editor-fold defaultstate="collapsed" desc="Award Map Constants">
var ssToIdMap = [["'Raid Achievements'!C10:D59", "SM", "<p id='SM_1'>Achieved 10,304,366 damage in Heroic Rancor Raid</p>"],
                 ["'Raid Achievements'!G10:J59", "BH", "<p id='BH_1'>Achieved X damage in heroic AAT</p><ul id='BH_2'><li id='BH_3'>Platinum: 45M or more</li><li id='BH_4'>Gold: 35M or more</li><li id='BH_5'>Silver: 25M or more</li><li id='BH_6'>Bronze: 15M or more</li></ul>"], 
                 ["'Guild Performance'!B10:C12", "OoP", "<p id='OoP_1'>Officer of the Month</p><p>100% Daily 600 for the month, and 3 highest donations for the month</p>"],
                 ["'Guild Performance'!E10:F12", "OoR", "<p id='OoR_1'>Member of the Month</p><p>100% Daily 600 for the month, and 3 highest donations for the month</p>"],
                 ["'Guild Performance'!I10:K59", "RoT", "<p id='RoT_1'>Recruit a new member of the SithHappens Alliance</p><ul id='RoT_2'><li id='RoT_3'>Chancellor: 5 or more</li><li id='RoT_4'>Duke/Duchess: 3-4</li><li id='RoT_5'>Baron/Baroness: 1-2</li></ul>"],
                 ["'Guild Performance'!N10:P19", "BoD", "<p id='BoD_1'>Highest Character GP increase of the Month</p>"],
                 ["RANK!B12:E61", "SER", "<p id='SER_1'>Achieved X GP in Service to the Sith Empire</p><ul id='SER_2'><li id='SER_3'>Dark Lord of the Sith: 3.8M+</li><li id='SER_4'>Shadow Hand: 3.4M+</li><li id='SER_5'>Sith Lord: 3M+</li><li id='SER_6'>Sith Acolyte: 2.6M+</li><li id='SER_7'>Sith Trooper: 2.2M+</li><li id='SER_8'>Sith Assassin: 1.8M+</li><li id='SER_8'>Night Sister|Brother: 1.4M+</li></ul>"], 
                 ["'TB Awards'!B10:D59", "OoSL", "<p id='OoSL_1'>Successfully Complete 104 Combat Missions - Hoth Rebel Assault</p><p id='OoSL_2'>Successfully Complete 84 Combat Missions - Hoth Imperial Retaliation</p>"],
                 ["'TB Awards'!F10:H59", "DLW", "<p id='DLW_1'>Assign at least 105 Characters to Platoons in a single TB - Hoth Rebel Assault</p><p id='DLW_1'>Assign at least 80 Characters to Platoons in a single TB - Hoth Imperial Retaliation</p>"],
                 ["'TB Awards'!J10:L59", "OoN", "<p id='OoN_1'>Complete the ROLO Special Mission and achieve 6/6 in all Combat Missions in P6 - Hoth Rebel Assault</p><p id='OoN_1'>Complete the Starck Special Mission and achieve 6/6 in all Combat Missions in P6 - Hoth Imperial Retaliation</p>"],
                 ["'TW Performance'!B10:E17", "HiB", "<p id='HiB_1'>Awarded based on Banner Points earned for Offense or Defense in relation to Member's Galactic Power in the last completed Territory War</p>"],
                 ["'TW Performance'!H10:J20", "LMS", "<p id='LMS_1'>Awarded for Highest Performing individual Defense squads in the last completed Territory War</p>"],
                 ["'TW Performance'!L10:M12", "SB", "<p id='SB_1'>Awarded for overall Achievement (Offense and Defense) in the last month of Territory Wars.</p>"]
             ];
//</editor-fold>
function initPage(){
    log('initPage called');
    getSheetContent(["INFO!C1"], getOutlineLength);
    var body = document.getElementById("SithHappenedBody");
    body.appendChild(createElement('div', "interim_1", "sectionHeader", "LOADING..."));
    body.appendChild(createElement('div', "interim_2", 'loader'));
}

/*
 * range = array of ranges to pull from
 * listener = the listener for this request
 */
function getSheetContent (range, listener) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", listener);

    // Determine the URL to send
    var url = "https://sheets.googleapis.com/v4/spreadsheets/1pegfgcK_c-srTUrnKOAomKs-VbyJWhuna8E-REX3wY4/values";
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

function getOutlineLength () {
    log('getOutlineLength() - called');
    var ssData = JSON.parse(this.responseText);
    var len = ssData.values[0][0]*1;
    getSheetContent(["INFO!A2:B"+(2+len)], buildPageContent);
}
function buildPageContent () {
    log('buildPageContent() - called');
    var int1 = document.getElementById("interim_1");
    var int2 = document.getElementById("interim_2");
    int1.parentNode.removeChild(int1);
    int2.parentNode.removeChild(int2);
    var ssData = JSON.parse(this.responseText).values;
    var sections = [];
    var index = 0;
    for(var i = 0; i<ssData.length;i++){
        if(ssData[i][1] != undefined){
            log('buildPageContent() - Processing row: '+ssData[i][0]+' '+ssData[i][1]);
            if(ssData[i][0] != undefined && ssData[i][0] != ''){ // This is the start of a new section
                log('buildPageContent() - This is a new section');
                if(i != 0)
                    index++;
                sections[index] = section(ssData[i][0], ssData[i][1]);
            } else { // This is a continuation of the current section
                log('buildPageContent() - This is a continuation');
                sections[index].addContent(ssData[i][1]);
            }
        } else {
            log('buildPageContent() - Skipping undefined row');
        }
    }
    for(var i = 0; i<sections.length;i++){
        sections[i].addToPage();
    }
    
    var ranges = '';
    for (var i=0, ssToId; ssToId = ssToIdMap[i]; i++){
        if(ranges != '')
            ranges += "&ranges=";
        ranges += ssToId[0];
    }
    debug = false;
    sendSSReq(true, ranges);
}

function section(id, content){
    if (!(this instanceof section))
        return new section(id, content)
    this.id = id;
    this.content = [];
    this.content[0] = content;
}

section.prototype.addContent = function(content){
    this.content[this.content.length] = content;
}

// createElement(elementType, id, clazz, html)
section.prototype.addToPage = function(){
    var body = document.getElementById("SithHappenedBody");
    if(this.id == "Guild Leader"){
        var obj = createElement('div', undefined, 'section');
        obj.appendChild(createElement('div', undefined, 'sectionHeader', this.content[0]));
        body.appendChild(obj);
    }
    else if(this.id == "Guild Officers"){
        var secObj = createElement('div', undefined, 'section');
        var obj = createElement('div', undefined, 'sectionHeader', this.content[0]);
        obj.setAttribute('style', 'color: darkgrey; font-size: 22px');
        secObj.appendChild(obj);
        secObj.appendChild(createElement('div', undefined, 'sectionContent'));
        body.appendChild(secObj);
    }
    else if(this.id == "Recruitment" || this.id == "TBInfo" || this.id == "TWInfo"){
        var secObj = createElement('div', undefined, 'section');
        secObj.appendChild(createElement('div', undefined, 'sectionHeader', this.content[0]));
        if(this.content.length > 1){
            var conObj = createElement('ul');
            for(var i=1;i<this.content.length;i++){
                conObj.appendChild(createElement('li', undefined, undefined, this.content[i]));
            }
            var secContent = createElement('div', undefined, 'sectionContent');
            secContent.appendChild(conObj);
            secObj.appendChild(secContent);
        }
        body.appendChild(secObj);
    }
    else if(this.id == "Requirements"){
        var secObj = createElement('div', undefined, 'section');
        secObj.appendChild(createElement('div', undefined, 'sectionHeader', this.content[0]));
        if(this.content.length > 1){
            var conObj = createElement('ol');
            for(var i=1;i<this.content.length;i++){
                conObj.appendChild(createElement('li', undefined, undefined, this.content[i]));
            }
            var secContent = createElement('div', undefined, 'sectionContent');
            secContent.appendChild(conObj);
            secObj.appendChild(secContent);
        }
        body.appendChild(secObj);
    }
    else if(this.id == "Awards"){
        var sec_GPA = createElement('div', undefined, 'section');
        sec_GPA.appendChild(createElement('div', undefined, 'sectionHeader', "Guild Performance Awards"));
        sec_GPA.appendChild(assembleAwardObj('RoT', 'Rule of Two'));
        sec_GPA.appendChild(assembleAwardObj('BoD', 'Brotherhood of Darkness'));
        sec_GPA.appendChild(createElement('br'));
        sec_GPA.appendChild(assembleAwardObj('OoP', 'Order of Plagueis'));
        sec_GPA.appendChild(assembleAwardObj('OoR', 'Order of Revan'));
        sec_GPA.appendChild(assembleAwardObj('SER', 'Sith Empire Ranks'));
        body.appendChild(sec_GPA);

        var sec_TBA = createElement('div', undefined, 'section');
        sec_TBA.appendChild(createElement('div', undefined, 'sectionHeader', "Territory Battle Awards"));
        sec_TBA.appendChild(assembleAwardObj('OoSL', 'Order of the Sith Lords'));
        sec_TBA.appendChild(assembleAwardObj('DLW', 'Dark Lords Wrath'));
        sec_TBA.appendChild(assembleAwardObj('OoN', 'Order of Nihilus'));
        body.appendChild(sec_TBA);

        var sec_TWA = createElement('div', undefined, 'section');
        sec_TWA.appendChild(createElement('div', undefined, 'sectionHeader', "Territory War Awards"));
        sec_TWA.appendChild(assembleAwardObj('HiB', 'Heroes in Battle'));
        sec_TWA.appendChild(assembleAwardObj('LMS', 'Last Man Standing'));
        sec_TWA.appendChild(assembleAwardObj('SB', 'Sith Berserker'));
        body.appendChild(sec_TWA);

        var sec_RA = createElement('div', undefined, 'section');
        sec_RA.appendChild(createElement('div', undefined, 'sectionHeader', "Raid Awards"));
        sec_RA.appendChild(assembleAwardObj('SM', 'Sith Master (Rancor Butcher)'));
        sec_RA.appendChild(assembleAwardObj('BH', 'Blind Hatred (Tank Destroyer)'));
        body.appendChild(sec_RA);
    } else {
        var secObj = createElement('div', undefined, 'section');
        secObj.appendChild(createElement('div', undefined, 'sectionHeader', this.content[0]));
        if(this.content.length > 1){
            var conObj = createElement('div', undefined, 'sectionContent');
            for(var i=1;i<this.content.length;i++){
                conObj.appendChild(createElement('p', undefined, undefined, this.content[i]));
            }
            secObj.appendChild(conObj);
        }
        body.appendChild(secObj);
    }
}

function assembleAwardObj(id, desc){
    var secContentCenter = createElement('div', undefined, 'sectionContent center');
    var secSubHeader = createElement('div', undefined, 'sectionSubHeader', desc);
    secSubHeader.setAttribute('onmouseover', "toggle(event, '"+id+"')");
    secSubHeader.setAttribute('onmouseout', "toggle(event, '"+id+"')");
    secSubHeader.setAttribute('onclick', "toggle(event, '"+id+"')");
    secContentCenter.appendChild(secSubHeader);
    var awardDiv = createElement('div', 'award_'+id, 'sectionContent');
    awardDiv.appendChild(createElement('div', undefined, 'loader'));
    secContentCenter.appendChild(awardDiv);
    return secContentCenter;
}

// <editor-fold defaultstate="collapsed" desc="Award Retrieval and Display">
function SSStandardListener () {
    log('SSStandardListener() - called');
    var ssData = JSON.parse(this.responseText);
    for (var i=0, ssToId; ssToId = ssToIdMap[i]; i++){
        log('SSStandardListener() - Looking for :'+ssToId);
        for(var j=0, range; range = ssData.valueRanges[j]; j++){
            if(range.range == ssToId[0]){
                log('SSStandardListener() - Found it');
                initAwardTable(ssToId[1], range.values, ssToId[2]);
            } else {
                log('SSStandardListener() - Skipping: '+range.range);
            }
        }
    }
    fixWidths();
    fixEmpties();
}

function initAwardTable(sectionId, values, desc) {
    log('initAwardTable('+sectionId+','+values+','+desc+')');
    var thRow = document.createElement('tr');
    switch (sectionId){
        case 'SM':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'BH':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Level'));
            thRow.appendChild(createTH('Score'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'OoP':
            thRow.appendChild(createTH(values[0][0]));
            break;
        case 'OoR':
            thRow.appendChild(createTH(values[0][0]));
            break;
        case 'RoT':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Level'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'BoD':
            thRow.appendChild(createTH(values[0][0]));
            break;
        case 'OoSL':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Awarded For'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'DLW':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Awarded For'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'OoN':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Awarded For'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'SER':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Rank'));
            thRow.appendChild(createTH('Galactic Power'));
            thRow.appendChild(createTH('Date Awarded'));
            break;
        case 'HiB':
            thRow.appendChild(createTH('TW Date'));
            thRow.appendChild(createTH('Top Defenders'));
            thRow.appendChild(createTH('Top Attackers'));
            break;
        case 'LMS':
            thRow.appendChild(createTH('Member'));
            thRow.appendChild(createTH('Squad'));
            thRow.appendChild(createTH('Enemies Slain'));
            break;
        case 'SB':
            thRow.appendChild(createTH('Rating'));
            thRow.appendChild(createTH('Member'));
            break;
    }
    var tbody = finalizeTBody(sectionId, values);
    var theader = document.createElement('thead');
    theader.appendChild(thRow);
    var table = document.createElement('table');
    table.setAttribute('class', 'scroll');
    table.appendChild(theader);
    table.appendChild(tbody);
    var awardDiv = document.getElementById('award_'+sectionId);
    removeAllChildren(awardDiv);
    awardDiv.appendChild(createDescDiv(sectionId, desc));
    awardDiv.appendChild(table);
}

function fixWidths(){
    var tables = document.getElementsByClassName('scroll');
    for(var i = 0; i < tables['length']; i++){
        log('fixWidths() - value of table = '+tables[i]);
        var headCells = tables[i].childNodes[0].firstChild.childNodes;
        var bodyCells = tables[i].childNodes[1].firstChild.childNodes;
        for(var j = 0; j < bodyCells['length']; j++){
            if(bodyCells[j].offsetWidth > headCells[j].offsetWidth){
                headCells[j].style.width = (bodyCells[j].offsetWidth-2)+'px';
            } else if(headCells[j].offsetWidth > bodyCells[j].offsetWidth){
                bodyCells[j].style.width = headCells[j].offsetWidth+'px';
                headCells[j].style.width = (headCells[j].offsetWidth+18)+'px';
            }

        }
    }
}

function fixEmpties(){
    var tables = document.getElementsByClassName('scroll');
    for(var i = 0; i < tables['length']; i++){
        var bodyRow = tables[i].childNodes[1].firstChild;
        log('fixEmpties() - Checking '+bodyRow.firstChild.innerHTML);
        if(bodyRow.firstChild.innerHTML == 'Not Yet Awarded'){
            log('fixEmpties() - If triggered setting width to grid');
            bodyRow.style.display = 'grid';
        }
    }
}

function createTH(value){
    var th = document.createElement('th');
    th.innerHTML = value;
    return th;
}

function finalizeTBody (sectionId, values){
    log('finalizeTBody(sectionId,tbody,values) - called');
    var tbody = document.createElement('tbody');
    if(values == undefined || values[0][0] == ""){     log('finalizeTBody(sectionId,tbody,values) - values is undefined or the first value is empty');
        var spacer;
        if (sectionId == 'BH' || sectionId == 'SER'){
            spacer = 4;
        } else if (sectionId == 'RoT' || sectionId == 'OoSL' || sectionId == 'DLW' || sectionId == 'OoN'){
            spacer = 3;
        } else {
            spacer = 2;
        } 
        var trBlank = document.createElement('tr');
        trBlank.appendChild(createTD("Not Yet Awarded", spacer));
        tbody.appendChild(trBlank);
    } else if (sectionId == 'OoP' || sectionId == 'OoR'){      log('finalizeTBody(sectionId,tbody,values) - This is the OoP or OoR Section');
        for(var i = 0, value; value = values[i];i++){
            var tr = document.createElement('tr');
            tr.appendChild(createTD(value[1]));
            tbody.appendChild(tr);
        }
    } else {      log('finalizeTBody(sectionId,tbody,values) - Entered the general section');
        var hibDate = "";
        for(var i = 0, value; value = values[i];i++){
            var tr = document.createElement('tr');
            if (sectionId == 'BH' || sectionId == 'SER'){
                tr.appendChild(createTD(value[0]));
                tr.appendChild(createTD(value[1]));
                tr.appendChild(createTD(value[2]));
                tr.appendChild(createTD(value[3]));
            } else if (sectionId == 'RoT' || sectionId == 'LMS'){
                tr.appendChild(createTD(value[0]));
                tr.appendChild(createTD(value[1]));
                tr.appendChild(createTD(value[2]));
            } else if (sectionId == 'OoSL' || sectionId == 'DLW' || sectionId == 'OoN'){
                tr.appendChild(createTD(value[1]));
                tr.appendChild(createTD(value[2]));
                tr.appendChild(createTD(value[0]));
            } else if (sectionId == 'BoD'){
                tr.appendChild(createTD(value[2]));
            } else if (sectionId == 'HiB'){
                if(value[0] != ""){
                    hibDate = value[0];
                } else {
                    if(hibDate != ""){
                        var td = createTD(hibDate);
                        td.setAttribute("rowspan", "3");
                        tr.appendChild(td);
                        hibDate = "";
                    }
                    tr.appendChild(createTD(value[1]));
                    tr.appendChild(createTD(value[3]));
                }
            } else {
                tr.appendChild(createTD(value[0]))
                tr.appendChild(createTD(value[1]));
            }
            if(hibDate == "")
                tbody.appendChild(tr);
        }
    }
    return tbody;
}

function createTD(value, spacer){
    var td = document.createElement('td');
    if(value == undefined)
        value = "";
    td.innerHTML = value;
    if(spacer != undefined && spacer > 1)
        td.setAttribute('colSpan', spacer);
    return td;
}

function createDescDiv(sectionId, desc){
    var dd = document.createElement('div');
    dd.setAttribute('style', 'display:none;');
    dd.setAttribute('id', 'desc_'+sectionId);
    dd.setAttribute('onmouseleave', "toggle(event, '"+sectionId+"')");
    
    var img = '<img id=img_'+sectionId+' src="/swgoh/images/Image_'+sectionId+'.jpg">';
    dd.innerHTML = img + desc;
    return dd;
}

function toggle(event, sectionId){
    log('toggle(event, sectionId) - called by: '+event.target.id+' with: '+event.type);

    var dd = document.getElementById('desc_'+sectionId);
    var imgd = document.getElementById('img_'+sectionId);
    var width = document.getElementById('award_'+sectionId).offsetWidth;

    dd.style.width = width+'px';
    imgd.style.width = width+'px';
    if(event.type == 'mouseover') {
        dd.style.display = "block";
    } else if(event.type == 'mouseleave'){
        dd.style.display = "none";
    } else if(event.type == 'mouseout'){
        if(event.relatedTarget != undefined){
            if(event.relatedTarget.id.search(sectionId) > -1){
                return;
            }
            var children = event.relatedTarget.childNodes;
            if(children != undefined){
                for(var i=0; i < children.length; i++){
                    if(children[i] != undefined && children[i].id != undefined && children[i].id.search(sectionId) > -1){
                        if(children[i].className == undefined || children[i].className != 'scroll'){
                            return;
                        }
                    }
                }
            }
        }
        dd.style.display = "none";
    } else {
        if(getComputedStyle(dd, null).getPropertyValue("display") == 'none')
            dd.style.display = "block";
        else
            dd.style.display = "none";
  }
}
// </editor-fold>