function populateStandardTable(response){
    var table = document.getElementById('shipTableBody');

    // Create the Header Row
    var headRow = document.createElement('tr');
    var headCell = document.createElement('th');
    headCell.textContent = 'Player Name';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Ship Name';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Ship Level';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Star Level';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Crew Members';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Alignment';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Ship Power';
    headRow.appendChild(headCell);
    table.appendChild(headRow);
    
    var data = JSON.parse(response);

    if(data[0] === 'undefined'){
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.setAttribute('colspan', '7');
        cell.setAttribute('align', 'center');
        cell.textContent = "No Results Returned";
        row.appendChild(cell);
        table.appendChild(row);
    } else {
        // Populate the Data rows
        var newest = 0;
        for (var i = 0; i < data.length; i++) {
            if(newest < data[i][data[i].length-2]){
                newest = data[i][data[i].length-2];
            }
            var row = document.createElement('tr');
            row.setAttribute("alt", "Last Update: "+new Date(data[i][data[i].length-2]));
            for (var j = 0; j < data[i].length-2; j++) {
                //if j == 6 (Power column) check against j == 3 (StarLevel Column)
                var cell = document.createElement('td');
                if(j == 0)
                    cell.setAttribute("onClick", "window.document.location='https://swgoh.gg"+data[i][data[i].length-1]+"'; ");
                if(j != 6 || data[i][j] != 0 || data[i][3] == 0){
                    cell.textContent = data[i][j];
                } else {
                    cell.textContent = 'Unavailable';
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        // Add Count/Newest Record Info here
        var row = document.createElement('tr');

        var countLabelCell = document.createElement('td');
        countLabelCell.textContent = "# of Results:";
        row.appendChild(countLabelCell);
        var countCell = document.createElement('td');
        countCell.textContent = data.length;
        row.appendChild(countCell);

        var spacerCell = document.createElement('td');
        spacerCell.setAttribute('colspan', '3');
        row.appendChild(spacerCell);

        var dateLabelCell = document.createElement('td');
        dateLabelCell.textContent = "Last Updated:";
        row.appendChild(dateLabelCell);
        var dateCell = document.createElement('td');
        var date = new Date(+newest);
        dateCell.textContent = dateToString(date);
        row.appendChild(dateCell);

        table.appendChild(row);
    }
}

function populateMacroTable(response){
    var table = document.getElementById('shipTableBody');
    var data = JSON.parse(response);

    if(data[0] === 'undefined'){
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.setAttribute('colspan', '7');
        cell.setAttribute('align', 'center');
        cell.textContent = "No Results Returned";
        row.appendChild(cell);
        table.appendChild(row);
    } else {
        for (var i = 0; i < data.length; i++) {
            var row = document.createElement('tr');
            // Populate the Header Row
            if(i == 0){
                for (var j = 0; j < data[i].length; j++) {
                    var cell = document.createElement('th');
                    if(data[i][j] != -1)
                        cell.textContent = data[i][j];
                    else
                        cell.textContent = 0;
                    row.appendChild(cell);
                }
            // Populate Data rows
            } else {
                for (var j = 0; j < data[i].length; j++) {
                    var cell = document.createElement('td');
                    if(data[i][j] != -1)
                        cell.textContent = data[i][j];
                    else
                        cell.textContent = 0;
                    row.appendChild(cell);
                }
            }
            table.appendChild(row);
        }
    }
}

function populateFilters(){
    var memberNames = [];
    var shipNames = [];
    var shipLevels = ['Any','0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
    '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
    '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
    '81', '82', '83', '84', '85'];
    var starLevels = ['Any','0', '1', '2', '3', '4', '5', '6', '7'];
    var crewNames = [];
    var alignments = ['Any','Light Side', 'Dark Side'];
    var operators = [' ','=', '<', '<=', '>', '>='];

    var table = document.getElementById('shipTableBody');
    for (var i = 0, row; row = table.rows[i]; i++) {
        if(row.className != "totalRow"){
            var MemberNameCell = row.cells[0];
            if(!contains(MemberNameCell.innerHTML, memberNames)){
                memberNames.push(MemberNameCell.innerHTML);
            }
            var shipNameCell = row.cells[1];
            if(!contains(shipNameCell.innerHTML, shipNames)){
                shipNames.push(shipNameCell.innerHTML);
            }
            var crewNameCell = row.cells[4];
            if(!contains(crewNameCell.innerHTML, crewNames)){
                crewNames.push(crewNameCell.innerHTML);
            }
        }
    }
    for(i = 0; i<memberNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', memberNames[i]);
        option.innerHTML = memberNames[i];
        document.getElementById('MemberName-input').appendChild(option);
    }
    for(i = 0; i<shipNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', shipNames[i]);
        option.innerHTML = shipNames[i];
        document.getElementById('shipName-input').appendChild(option);
    }
    for(i = 0; i<operators.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', operators[i]);
        option.innerHTML = operators[i];
        document.getElementById('shipLevel-operator').appendChild(option);
    }
    for(i = 0; i<operators.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', operators[i]);
        option.innerHTML = operators[i];
        document.getElementById('starLevel-operator').appendChild(option);
    }
    for(i = 0; i<operators.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', operators[i]);
        option.innerHTML = operators[i];
        document.getElementById('Power-operator').appendChild(option);
    }
    for(i = 0; i<shipLevels.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', shipLevels[i]);
        option.innerHTML = shipLevels[i];
        document.getElementById('shipLevel-input').appendChild(option);
    }
    for(i = 0; i<starLevels.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', starLevels[i]);
        option.innerHTML = starLevels[i];
        document.getElementById('starLevel-input').appendChild(option);
    }
    for(i = 0; i<crewNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', crewNames[i]);
        option.innerHTML = crewNames[i];
        document.getElementById('crewMembers-input').appendChild(option);
    }
    for(i = 0; i<alignments.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', alignments[i]);
        option.innerHTML = alignments[i];
        document.getElementById('alignment-input').appendChild(option);
    }
}

function buildQueryString(){
    var queries = [];
    if(document.getElementById('MemberName-input').selectedIndex != 0){
        queries.push("MemberName='"+escapeSingleQuote(document.getElementById('MemberName-input').value)+"'");
    }
    if(document.getElementById('shipName-input').selectedIndex != 0){
        queries.push("shipName='"+escapeSingleQuote(document.getElementById('shipName-input').value)+"'");
    }
    if(document.getElementById('shipLevel-input').selectedIndex != 0){
        if(document.getElementById('shipLevel-operator').selectedIndex == 0){
            alert("You must select an operator for Ship Level");
            return;
        }
        queries.push("shipLevel"+document.getElementById('shipLevel-operator').value+document.getElementById('shipLevel-input').value);
    }
    if(document.getElementById('starLevel-input').selectedIndex != 0){
        if(document.getElementById('starLevel-operator').selectedIndex == 0){
            alert("You must select an operator for Star Level");
            return;
        }
        queries.push("starLevel"+document.getElementById('starLevel-operator').value+document.getElementById('starLevel-input').value);
    }
    if(document.getElementById('crewMembers-input').selectedIndex != 0){
        queries.push("crewMembers='"+escapeSingleQuote(document.getElementById('crewMembers-input').value)+"'");
    }
    if(document.getElementById('alignment-input').selectedIndex != 0){
        queries.push("alignment='"+escapeSingleQuote(document.getElementById('alignment-input').value)+"'");
    }
    if(document.getElementById('Power-input').value != ''){
        if(document.getElementById('Power-operator').selectedIndex == 0){
            alert("You must select an operator for Power");
            return;
        }
        queries.push("Power"+document.getElementById('Power-operator').value+document.getElementById('Power-input').value);
    }
    var queryString = '';
    for(i=0;i<queries.length;i++){
        if(i == 0){
            queryString += queries[i];
        } else {
            queryString += " AND "+queries[i];
        }
    }
    return queryString;
}

function parseFilterInfo (guild) {
    var queryString = buildQueryString();

    // Erase the Table and write a wait message
    var table = document.getElementById('shipTableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    var table = document.getElementById('shipTableBody');
    var headRow = document.createElement('tr');
    var headCell = document.createElement('th');
    headCell.textContent = 'Player Name';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Ship Name';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Ship Level';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Star Level';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Crew Members';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Alignment';
    headRow.appendChild(headCell);
    headCell = document.createElement('th');
    headCell.textContent = 'Ship Power';
    headRow.appendChild(headCell);
    table.appendChild(headRow);
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.setAttribute('colspan', '7');
    cell.setAttribute('align', 'center');
    cell.textContent = "Executing Database Query....";
    row.appendChild(cell);
    table.appendChild(row);

    sendDBReq('shipTable', guild, queryString);
}

function runMacroSearch (guild, ID) {
    if((document.getElementById('starLevel-operator').value != '>=' && document.getElementById('starLevel-operator').value != '>') || document.getElementById('starLevel-input').value == undefined){
        alert("You must set a > or >= Star Level Filter to use this search");
        return;
    }

    // Erase the Table and write a wait message
    var table = document.getElementById('shipTableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    var table = document.getElementById('shipTableBody');
    var headRow = document.createElement('tr');
    var headCell = document.createElement('th');
    headCell.textContent = "Executing Database Query....";
    headRow.appendChild(headCell);
    table.appendChild(headRow);

    //sendDBReq (caller, guild, queryString, sortID, macro)
    sendDBReq('shipTable', guild, buildQueryString(), '', ID);
}

function dbStandardListener () {
    var table = document.getElementById('shipTableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    populateStandardTable(this.responseText);
}

function dbMacroListener () {
    var table = document.getElementById('shipTableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    populateMacroTable(this.responseText);
}