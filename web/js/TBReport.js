var tbtype, headers, filterIds;
function populateFilters(){
    var guildNames = ['SithHappened', 'SithHappens'];
    for(i = 0; i<guildNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', guildNames[i]);
        option.innerHTML = guildNames[i];
        if(guild && guild == guildNames[i]){
            option.selected = true;
        }
        document.getElementById('guildName-input').appendChild(option);
    }
    retrieveTBData();
}

function retrieveTBData() {
    var queries = [];
    queries.push("GuildName='"+document.getElementById('guildName-input').value+"'");
    queries.push("TB_ID='"+document.getElementById('period-select').value+"'");
    queries.push("Phase="+document.getElementById('phase-select').value);
    var queryString = '';
    for(i=0;i<queries.length;i++){
        if(i == 0){
            queryString += queries[i];
        } else {
            queryString += " AND "+queries[i];
        }
    }
    sendDBReq('TBReport', queries[0], queryString);
}

function dbStandardListener () {
    var table = document.getElementById('TBDataTableBody');
    removeAllChildren(table);
    tbtype = "";
    var data = JSON.parse(this.responseText);
    tbtype = data[0];

    var phase = document.getElementById('phase-select').value;
    if( phase == '1' && tbtype == 'HOTH_LS') {
        filterIds = ['special', 'CM_1', 'CM_2', 'deployment'];
    } else if( phase == '1' && tbtype == 'HOTH_DS') {
        filterIds = ['special', 'CM_1', 'CM_2', 'CM_3', 'deployment'];
    } else if( phase == '2'){
        filterIds = ['special', 'CM_1', 'CM_2', 'CM_3', 'deployment'];
    } else {
        filterIds = ['SM_1', 'deployment_ship', 'special', 'CM_1', 'CM_2', 'CM_3', 'deployment'];
    }

    if( phase == '1' && tbtype == 'HOTH_LS') {
        headers = ["Member", "Special (Phoenix)", "CM (1)", "CM (2)", "Deployment"];
    } else if( phase == '1' && tbtype == 'HOTH_DS') {
        headers = ["Member", "Special(Empire)", "CM (North-DS)1", "CM (North-DS)2", "CM (South-DS)", "Deployment"];
    } else if( phase == '2' && tbtype == 'HOTH_LS'){
        headers = ["Member", "Special (R1)", "CM (North-HRS)", "CM (North-LS)", "CM (South-LS)", "Deployment"];
    } else if( phase == '2' && tbtype == 'HOTH_DS'){
        headers = ["Member", "Special(BH)", "CM (North-DS)", "CM (North-Snow)", "CM (South-DS)", "Deployment"];
    } else if( phase == '3' && tbtype == 'HOTH_LS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (COLO)", "CM (Mid-LS)", "CM (Mid-HRS)", "CM (South-LS)", "Deployment"];
    } else if( phase == '3' && tbtype == 'HOTH_DS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (Starck)", "CM (Mid-DS)", "CM (Mid-BH)", "CM (South-DS)", "Deployment"];
    } else if( phase == '4' && tbtype == 'HOTH_LS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (ROLO)", "CM (Mid-HRS)", "CM (Mid-LS)", "CM (South-LS)", "Deployment"];
    } else if( phase == '4' && tbtype == 'HOTH_DS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (Chimaera)", "CM (Mid-DS)", "CM (Mid-Veers/Snow)", "CM (South-DS)", "Deployment"];
    } else if( phase == '5' && tbtype == 'HOTH_LS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (CLS)", "CM (Mid-HRS)", "CM (Phoenix)", "CM (South-LS)", "Deployment"];
    } else if( phase == '5' && tbtype == 'HOTH_DS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (BH)", "CM (Mid-DS)", "CM (South-Empire)", "CM (South-DS)", "Deployment"];
    } else if( phase == '6' && tbtype == 'HOTH_LS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (OLOs)", "CM (Mid-R1)", "CM (Mid-Reb)", "CM (South-LS)", "Deployment"];
    } else if( phase == '6' && tbtype == 'HOTH_DS'){
        headers = ["Member", "Ship Mission", "Ship Deployment", "Special (Veers/Starck/Droid)", "CM (Mid-DS)", "CM (Mid-Empire)", "CM (South-DS)", "Deployment"];
    }

    populateTBDataTable(data);
    refreshReportTable();
}

function populateTBDataTable(data){
    var table = document.getElementById('TBDataTableBody');
    for (var i = 1, entry; entry = data[i]; i++) {
        var row = document.createElement('tr');
        for(var j = 0, content; content = entry[j]; j++){
            var cell = document.createElement('td');
            cell.textContent = content;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    updateFilters();
}

function updateFilters(){
    // Gather the current filter selection data if any
    var filtersDiv = document.getElementById('filters'), filters = filtersDiv.getElementsByTagName('input');
    var savedSettings = {};
    for(var i=0;i<filters.length;i++){
        if(filters[i].checked){
            savedSettings[filters[i].id] = filters[i].checked;
        }
    }
    
    var positiveFilterDiv = document.getElementById('positiveFilters');
    var negativeFilterDiv = document.getElementById('negativeFilters');
    removeAllChildren(positiveFilterDiv);
    removeAllChildren(negativeFilterDiv);
    
    for(var i = 0; i<filterIds.length;i++){
        positiveFilterDiv.appendChild(createDynamicFilter(headers[i+1], "P."+filterIds[i], savedSettings["P."+filterIds[i]]));
        negativeFilterDiv.appendChild(createDynamicFilter(headers[i+1], "N."+filterIds[i], savedSettings["N."+filterIds[i]]));
    }
}

function createDynamicFilter(filterDisplayName, filterID, wasChecked){
    var filterBase = document.createElement('div');
    filterBase.setAttribute('class', 'infoPlate');
    filterBase.innerHTML = filterDisplayName;
    var radioRequire = document.createElement('input');
    radioRequire.setAttribute('type', 'checkbox');
    radioRequire.setAttribute('name', filterID);
    radioRequire.setAttribute('value', 'true');
    radioRequire.setAttribute('id', filterID);
    if(wasChecked){
        radioRequire.setAttribute('checked', true);
    }
    radioRequire.setAttribute('onchange', 'refreshReportTable()');
    filterBase.appendChild(radioRequire);
    return filterBase;
}

function refreshReportTable() {
    //Remove entries from current table
    var table = document.getElementById('reportTableBody');
    removeAllChildren(table);

    var records = [];
    var summaryData = new summaries(headers); 
    var dataTable = document.getElementById('TBDataTableBody');
    for(var i=0, dtRow; dtRow = dataTable.rows[i];i++){
        var row = document.createElement('tr');
        var matchedAFilter = false;
        for(var j=1, dtCell; dtCell = dtRow.cells[j];j++){
            if(j != 2){
                var value = dtCell.innerHTML;
                if(j > 2){ // Actual statistics from the table are processed here
                    var cell = document.createElement('td');
                    cell.innerHTML = value;
                    row.appendChild(cell);
                    var negativeFilterSelected = document.getElementById('N.'+filterIds[j-3]).checked;
                    var positiveFilterSelected = document.getElementById('P.'+filterIds[j-3]).checked;
                    if(negativeFilterSelected && (value == 'Pending' || value == 'Holder')){ // This filter has been selected and applies to the record
                        matchedAFilter = true;
                    }
                    if(positiveFilterSelected && value != 'Pending' && value != 'Holder'){ // This filter has been selected and applies to the record
                        matchedAFilter = true;
                    }
                    summaryData.add(headers[j-2], value);
                } else {
                    var cell = document.createElement('td');
                    cell.innerHTML = value;
                    row.appendChild(cell);
                }
            }
        }
        if(matchedAFilter){ //If no filters matched we don't append the row
            records.push(row);
        }
    }
    
    if(records.length && records.length > 0){
        var hRow = document.createElement('tr');
        for(var i=0;i<headers.length;i++){
            var cell = document.createElement('th');
            cell.innerHTML = headers[i];
            hRow.appendChild(cell);
        }
        table.appendChild(hRow);
        for(var i=0; i<records.length;i++){
            table.appendChild(records[i]);
        }
        
        // Add the Count Row to the Bottom
        var sRow = document.createElement('tr');
        var descCell = document.createElement('td');
        descCell.innerHTML = 'Number of Matches:';
        descCell.setAttribute('colspan', headers.length-1);
        sRow.appendChild(descCell);
        var dispCell = document.createElement('td');
        dispCell.innerHTML = records.length;
        sRow.appendChild(dispCell);
        table.appendChild(sRow);
    } else {
        var hRow = document.createElement('tr');
        var cell = document.createElement('th');
        cell.innerHTML = "There are no records that match the criteria";
        hRow.appendChild(cell);
        table.appendChild(hRow);
    }
    //TODO: Add additional stats based on retrieved data
    var divSummary = document.getElementById('Summary');
    removeAllChildren(divSummary);
    divSummary.setAttribute('style', 'display:block;');
    for(var i = 1;i<headers.length;i++){
        var summaryBox = getSummaryBox(headers[i], summaryData.getValues(headers[i]), summaryData.count);
        if(summaryBox != undefined){
            divSummary.appendChild(summaryBox);
        }
    }
}

