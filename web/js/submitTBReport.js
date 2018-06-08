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

function reloadSubmitPage() {
    var memberURI = document.getElementById('MemberName-input').value;
    var guild = document.getElementById('guildName-input').value;
    window.sessionStorage.setItem("Phase", document.getElementById('phase-select').value);
    window.sessionStorage.setItem("TB_ID", document.getElementById('period-select').value);

    window.location.href = "http://sithhappens.net/swgoh/submitTBReport.jsp?guild="+guild+"&member="+memberURI;
}

function refreshReportTable() {
    var queries = [];
    queries.push("MemberURI='"+escapeSingleQuote(document.getElementById('MemberName-input').value)+"'");
    if(window.sessionStorage.getItem("Phase") != undefined && window.sessionStorage.getItem("Phase") != '' && window.sessionStorage.getItem("Phase") != null){
        var phaseOptions = document.getElementById('phase-select').childNodes;
        for(var i=0; i<phaseOptions.length; i++){
            if(phaseOptions[i].value == window.sessionStorage.getItem("Phase"))
                phaseOptions[i].selected = true;
        }
        window.sessionStorage.setItem("Phase", '');
    }
    queries.push("Phase="+document.getElementById('phase-select').value);
    if(window.sessionStorage.getItem("TB_ID") != undefined && window.sessionStorage.getItem("TB_ID") != '' && window.sessionStorage.getItem("TB_ID") != null){
        var TB_IDOptions = document.getElementById('period-select').childNodes;
        for(var i=0; i<TB_IDOptions.length; i++){
            if(TB_IDOptions[i].value == window.sessionStorage.getItem("TB_ID"))
                TB_IDOptions[i].selected = true;
        }
        window.sessionStorage.setItem("TB_ID", '');
    }
    queries.push("TB_ID='"+document.getElementById('period-select').value+"'");
    
    var queryString = '';
    for(i=0;i<queries.length;i++){
        if(i == 0){
            queryString += queries[i];
        } else {
            queryString += " AND "+queries[i];
        }
    }
    if(document.getElementById('MemberName-input').value != 'None')
        sendDBReq('submitTBReport', document.getElementById('guildName-input').value, queryString);
    else
        populateStandardTable('default');
}

function dbStandardListener () {
    removeAllChildren(document.getElementById('stats'));
    populateStandardTable(this.responseText);
}

function populateStandardTable(response){
    if(response == 'default'){
        var div = document.getElementById('stats');
        div.innerHTML = 'Please Select your Member name';
        var div = document.getElementById('Summary');
        div.setAttribute('style', 'display:none;');
    } else {
        var data = JSON.parse(response);
        var record = new TBRecord(data[0]);
        document.getElementById('stats').innerHTML = '';
        record.appendToDiv(document.getElementById('stats'));
        var divSummary = document.getElementById('Summary');
        removeAllChildren(divSummary);
        if(data[1] != undefined){
            divSummary.setAttribute('style', 'display:block;');
            var divDepSummary = document.createElement('div');
            divDepSummary.setAttribute('class', 'infoPlate');
            divDepSummary.innerHTML = 'Deployment Summary:';
            var uList = document.createElement('ul');
            for(var i = 1; i < data.length; i++){
                var item = document.createElement('li');
                item.innerHTML = data[i][0] + " : " + data[i][1];
                uList.appendChild(item);
            }
            divDepSummary.appendChild(uList);
            divSummary.appendChild(divDepSummary);
        }
    }
}

function submitReport(){
    var queries = [];
    queries.push("MemberURI="+escapeSingleQuote(document.getElementById('MemberName-input').value));
    queries.push("guildName="+escapeSingleQuote(document.getElementById('guildName-input').value));
    queries.push("TB_ID="+document.getElementById('period-select').value);
    queries.push("Phase="+document.getElementById('phase-select').value);
   
    var statsDiv = document.getElementById('stats'), stats = statsDiv.getElementsByTagName('select');
    for(var i=0;i<stats.length;i++){
        queries.push(stats[i].id+"="+stats[i].value);
    }
    
    var queryString = '';
    for(i=0;i<queries.length;i++){
        if(i == 0){
            queryString += queries[i];
        } else {
            queryString += "|"+queries[i];
        }
    }

    pushToDB('selfReporting', queryString);
}

function pushToDB (caller, data) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", dbPushListener);
 
    // Determine the URL to send
    var url = "http://sithhappens.net/swgoh/dataPush?caller="+caller+"&data="+encodeURIComponent(data);

    // Send the request
    oReq.open("GET", url);
    oReq.send();
}

function dbPushListener () {
    if(this.responseText == "0"){
        alert("Update Successful");
        updateDeploymentSummary();
    } else {
        alert("An error occured attempting to update the record\n"+this.responseText);
    }
}

function updateDeploymentSummary () {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", dbDeploymentListener);
 
    // Determine the URL to send
    var url = "http://sithhappens.net/swgoh/dataRetrieval?caller=DeploymentSummary&guild="+escapeSingleQuote(document.getElementById('guildName-input').value);
    url += "&queryString="+encodeURIComponent("Phase="+document.getElementById('phase-select').value+" AND TB_ID='"+document.getElementById('period-select').value+"'");

    // Send the request
    oReq.open("GET", url);
    oReq.send();
}

function dbDeploymentListener () {
    var data = JSON.parse(this.responseText);
    var divSummary = document.getElementById('Summary');
    removeAllChildren(divSummary);
    if(data != undefined){
        divSummary.setAttribute('style', 'display:block;');
        var divDepSummary = document.createElement('div');
        divDepSummary.setAttribute('class', 'infoPlate');
        divDepSummary.innerHTML = 'Deployment Summary:';
        var uList = document.createElement('ul');
        for(var i = 0; i < data.length; i++){
            var item = document.createElement('li');
            item.innerHTML = data[i][0] + " : " + data[i][1];
            uList.appendChild(item);
        }
        divDepSummary.appendChild(uList);
        divSummary.appendChild(divDepSummary);
    }
}

function TBRecord(data){
    if (!(this instanceof TBRecord))
        return new TBRecord()
    this.headers = data[0];
    this.values = data[1];
    this.options = data[2];
}

TBRecord.prototype.appendToDiv=function (div){
    var ids;
    if(this.headers.length == 4){
        ids = ["special", "CM_1", "CM_2", "deployment"];
    }
    if(this.headers.length == 5){
        ids = ["special", "CM_1", "CM_2", "CM_3", "deployment"];
    }
    if(this.headers.length == 7){
        ids = ["SM_1", "deployment_ship", "special", "CM_1", "CM_2", "CM_3", "deployment"];
    }
    for (var i = 0; i < this.headers.length; i++) {
        div.appendChild(createDynamicInputDiv(this.headers[i], buildSelect(this.values[i], ids[i], this.options[i])));
    }
}

function createDynamicInputDiv(inputDisplayName, select){
    var inputBaseDiv = document.createElement('div');
    inputBaseDiv.setAttribute('class', 'infoPlate');
    var inputDisplay = document.createElement('div');
    inputDisplay.innerHTML = inputDisplayName;
    inputBaseDiv.appendChild(inputDisplay);
    inputBaseDiv.appendChild(select);
    return inputBaseDiv;
}

function buildSelect(currentVal, id, values){
    var select = document.createElement('select');
    select.setAttribute('id', id);
    for(var i=0;i<values.length;i++){
        var option = document.createElement('option');
        option.setAttribute('value', values[i][0]);
        option.innerHTML = values[i][1];
        if(currentVal == values[i][0])
            option.selected = true;
        else if(values[i][0] == "Pending" && currentVal == '')
            option.selected = true;
        select.appendChild(option);
    }
    return select;
}