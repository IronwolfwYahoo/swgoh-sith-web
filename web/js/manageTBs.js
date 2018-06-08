function initPage(){
    debug = false;
    log('initPage called');
    sendDBReq('manageTBs', '', '');
}

function dbStandardListener () {
    log('dbStandardListener called');
    removeAllChildren(document.getElementById('dataTable'));
    populateDataTable(this.responseText);
}

function populateDataTable(response){
    log('populateDataTable called with: ');
    log(response);
    var data = JSON.parse(response);
    var table = document.getElementById('dataTable');
    for (var i = 0, entry; entry = data[i]; i++) {
        var row = document.createElement('tr');
        for(var j = 0, content; content = entry[j]; j++){
            var cell = document.createElement('td');
            cell.textContent = content;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    refreshPageDisplay();
}

function refreshPageDisplay() {
    log('refreshPageDisplay called');
    var dataTable = document.getElementById('dataTable');
    removeAllChildren(document.getElementById('TBInstances'));
    var dataDisplayDiv = document.getElementById('TBInstances');
    for(var i=0, dtRow; dtRow = dataTable.rows[i];i++){
        if(i==0){
            var sep = document.createElement('div');
            sep.setAttribute('class', 'separator');
            dataDisplayDiv.appendChild(sep);
        }
        var instanceDiv = document.createElement('div');
        var id;
        for(var j=0, dtCell; dtCell = dtRow.cells[j];j++){
            var divBit = document.createElement('div');
            divBit.setAttribute('class', 'infoPlate');
            if(j == 0){
                divBit.innerHTML = '<b>ID:</b><br>';
                id = dtCell.innerHTML;
            }else if(j == 1)
                divBit.innerHTML = '<b>Type:</b><br>';
            else if(j == 2)
                divBit.innerHTML = '<b>Start Date:</b><br>';
            else if(j == 3)
                divBit.innerHTML = '<b>End Date:</b><br>';
            if(j == 2 || j == 3){
                divBit.innerHTML += dateUTCToLocal(dtCell.innerHTML);
            } else {
                divBit.innerHTML += dtCell.innerHTML;
            }
            instanceDiv.appendChild(divBit);
        }
        var buttonDiv = document.createElement('div');
        var editBtn = document.createElement('input');
        editBtn.setAttribute('type', 'button');
        editBtn.setAttribute('value', 'Edit TB');
        editBtn.setAttribute('onclick', "showEditWindow('"+id+"')");
        editBtn.setAttribute('style', 'margin-right: 5px;');
        var removeBtn = document.createElement('input');
        removeBtn.setAttribute('type', 'button');
        removeBtn.setAttribute('value', 'Remove');
        removeBtn.setAttribute('onclick', "removeTB('"+id+"')");
        removeBtn.setAttribute('style', 'margin-left: 5px;');
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(removeBtn);
        instanceDiv.appendChild(buttonDiv);
        dataDisplayDiv.appendChild(instanceDiv);

        var sep = document.createElement('div');
        sep.setAttribute('class', 'separator');
        dataDisplayDiv.appendChild(sep);
    }
}

function showEditWindow(type){
    if(type == 'new'){
        document.getElementById('editWindowTitle').innerHTML = '<b>Add New Territory Battle</b>';
        document.getElementById('saveBtn').setAttribute('onclick', 'updateTB("add");');
    } else {
        syncTableDataToForm(type);
        document.getElementById('editWindowTitle').innerHTML = '<b>Edit Territory Battle</b>';
        document.getElementById('saveBtn').setAttribute('onclick', 'updateTB("edit");');
    }
    document.getElementById('editInstanceDiv').setAttribute('style', 'display:block;');
}

function syncTableDataToForm(TB_ID) {
    log('syncTableDataToForm called');
    var dataTable = document.getElementById('dataTable');
    for(var i=0, dtRow; dtRow = dataTable.rows[i];i++){
        log('Checking: '+dtRow.cells[0].innerHTML);
        if(dtRow.cells[0].innerHTML == TB_ID){
            document.getElementById('TB_ID').value = dtRow.cells[0].innerHTML;
            document.getElementById('Type').value = dtRow.cells[1].innerHTML;
            //queries.push("StartDate="+dateLocalToUTCString(new Date(document.getElementById('start').value)));
            document.getElementById('start').value =dateDBStringToDTString(dtRow.cells[2].innerHTML);
            break;
        }
    }
}

function updateTBID(){
    log("(updateTBID) StartDate="+document.getElementById('start').value);
    if(document.getElementById('saveBtn').getAttribute('onclick') != 'updateTB("edit");'){
        if(document.getElementById('start').value != undefined && document.getElementById('start').value != ''){
            var startDate = new Date(document.getElementById('start').value);
            document.getElementById('TB_ID').value = convertToTB_ID(startDate);
        }
    }
}

function cancelEdit(){
    document.getElementById('editInstanceDiv').setAttribute('style', 'display:none;');
    document.getElementById('TB_ID').value = '';
    document.getElementById('Type').selectedIndex = 0;
    document.getElementById('start').value = '';
}

function removeTB(TB_ID){
    if(confirm("Remove Territory Battle: "+TB_ID+"?")){
        document.getElementById('TB_ID').value = TB_ID;
        updateTB('remove');
    }
}

function updateTB(action){
    var queries = [];
    queries.push("Action="+action);
    queries.push("TB_ID="+document.getElementById('TB_ID').value);
    if(action != "remove"){
        queries.push("Type="+document.getElementById('Type').value);
        queries.push("StartDate="+dateLocalToUTCString(new Date(document.getElementById('start').value)));
    }

    var queryString = '';
    for(i=0;i<queries.length;i++){
        log('Adding to queryString: "'+queries[i]+'"');
        if(i == 0){
            queryString += queries[i];
        } else {
            queryString += "|"+queries[i];
        }
    }
    pushToDB('manageTBs', queryString);
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
        cancelEdit();
        initPage();
    } else {
        alert("An error occured attempting to update the record\n"+this.responseText);
    }
}

function dateUTCToLocal(d){
    var date = new Date(d+" UTC");
    var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString("en-US",options);
}

function dateLocalToUTCString(d){
    return d.toISOString().replace("T", " ").replace(".000Z", "");
}

function dateDBStringToDTString(d){
    var date = new Date(d+" UTC");
    var options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false};
    var cS = date.toLocaleString("en-US",options);
    var dBits = [cS.substring(0, 2), cS.substring(3, 5), cS.substring(6, 10), cS.substring(cS.indexOf(" ")+1)];
    return dBits[2]+"-"+dBits[0]+"-"+dBits[1]+"T"+dBits[3];
}

function convertToTB_ID(d){
    var options = { year: 'numeric', month: '2-digit', day: '2-digit'};
    return d.toLocaleDateString("en-US",options)+'-'+addDays(d, 5).toLocaleDateString("en-US",options);
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}