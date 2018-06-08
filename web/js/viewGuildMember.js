function populateStandardTable(response){
    var table = document.getElementById('memberTableBody');
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
        var newest = 0;
        for (var i = 0; i < data.length; i++) {
            var row = document.createElement('tr');
            // Populate a Header Row
            if(data[i][0] == 'Player Name' || data[i][0] == 'P1 CMs' || data[i][0] == 'P3 CMs' || data[i][0] == 'P5 CMs'){
                for (var j = 0; j < data[i].length; j++) {
                    var cell = document.createElement('th');
                    cell.textContent = data[i][j];
                    row.appendChild(cell);
                }
                if(i != 0){ // These rows need a class <P1_P2/P3_P4/P5_P6> and id <memberURI-1-H/-2-H/-3-H>
                    
                    var memberURI;
                    if(data[i][0] == 'P1 CMs'){
                        row.setAttribute("class", "P1_P2");
                        memberURI = data[i-1][data[i-1].length-1];
                        row.setAttribute("id", memberURI+"-1-H");
                    } else  if (data[i][0] == 'P3 CMs'){
                        row.setAttribute("class", "P3_P4");
                        memberURI = data[i-3][data[i-3].length-1];
                        row.setAttribute("id", memberURI+"-2-H");
                    } else  if (data[i][0] == 'P5 CMs'){
                        row.setAttribute("class", "P5_P6");
                        memberURI = data[i-5][data[i-5].length-1];
                        row.setAttribute("id", memberURI+"-3-H");
                    }
                    row.style.display = 'none';
                }
            } else {
                if(data[i-1][0] == 'P1 CMs'){
                    row.setAttribute("class", "P1_P2");
                    row.setAttribute("id", data[i-2][data[i-2].length-1]+"-1-D");
                    row.style.display = 'none';
                    for (var j = 0; j < data[i].length; j++) {
                        var cell = document.createElement('td');
                        cell.textContent = data[i][j];
                        row.appendChild(cell);
                    }
                    var saveCell = document.createElement('td');
                    saveCell.setAttribute("id", "td-"+data[i-2][data[i-2].length-1]+"-1-D");
                    saveCell.setAttribute("style", "display:none;");
                    var saveBtn = document.createElement('input');
                    saveBtn.setAttribute("type", "button");
                    saveBtn.setAttribute("id", "save-"+data[i-2][data[i-2].length-1]+"-1-D");
                    saveBtn.setAttribute("value", "Save");
                    saveBtn.setAttribute("onClick", "saveData(this)");
                    saveCell.appendChild(saveBtn);
                    row.appendChild(saveCell);

                    var editCell = document.createElement('td');
                    var editBtn = document.createElement('input');
                    editBtn.setAttribute("type", "button");
                    editBtn.setAttribute("id", "edit-"+data[i-2][data[i-2].length-1]+"-1-D");
                    editBtn.setAttribute("value", "Edit");
                    editBtn.setAttribute("onClick", "editData(this)");
                    editCell.appendChild(editBtn);
                    row.appendChild(editCell);
                } else if(data[i-1][0] == 'P3 CMs'){
                    row.setAttribute("class", "P3_P4");
                    row.setAttribute("id", data[i-4][data[i-4].length-1]+"-2-D");
                    row.style.display = 'none';
                    for (var j = 0; j < data[i].length; j++) {
                        var cell = document.createElement('td');
                        cell.textContent = data[i][j];
                        row.appendChild(cell);
                    }
                    var saveCell = document.createElement('td');
                    saveCell.setAttribute("id", "td-"+data[i-4][data[i-4].length-1]+"-2-D");
                    saveCell.setAttribute("style", "display:none;");
                    var saveBtn = document.createElement('input');
                    saveBtn.setAttribute("type", "button");
                    saveBtn.setAttribute("id", "save-"+data[i-4][data[i-4].length-1]+"-2-D");
                    saveBtn.setAttribute("value", "Save");
                    saveBtn.setAttribute("onClick", "saveData(this)");
                    saveCell.appendChild(saveBtn);
                    row.appendChild(saveCell);

                    var editCell = document.createElement('td');
                    var editBtn = document.createElement('input');
                    editBtn.setAttribute("type", "button");
                    editBtn.setAttribute("id", "edit-"+data[i-4][data[i-4].length-1]+"-2-D");
                    editBtn.setAttribute("value", "Edit");
                    editBtn.setAttribute("onClick", "editData(this)");
                    editCell.appendChild(editBtn);
                    row.appendChild(editCell);
                } else if(data[i-1][0] == 'P5 CMs'){
                    row.setAttribute("class", "P5_P6");
                    row.setAttribute("id", data[i-6][data[i-6].length-1]+"-3-D");
                    row.style.display = 'none';
                    for (var j = 0; j < data[i].length; j++) {
                        var cell = document.createElement('td');
                        cell.textContent = data[i][j];
                        row.appendChild(cell);
                    }
                    var saveCell = document.createElement('td');
                    saveCell.setAttribute("id", "td-"+data[i-6][data[i-6].length-1]+"-3-D");
                    saveCell.setAttribute("style", "display:none;");
                    var saveBtn = document.createElement('input');
                    saveBtn.setAttribute("type", "button");
                    saveBtn.setAttribute("id", "save-"+data[i-6][data[i-6].length-1]+"-3-D");
                    saveBtn.setAttribute("value", "Save");
                    saveBtn.setAttribute("onClick", "saveData(this)");
                    saveCell.appendChild(saveBtn);
                    row.appendChild(saveCell);

                    var editCell = document.createElement('td');
                    var editBtn = document.createElement('input');
                    editBtn.setAttribute("type", "button");
                    editBtn.setAttribute("id", "edit-"+data[i-6][data[i-6].length-1]+"-3-D");
                    editBtn.setAttribute("value", "Edit");
                    editBtn.setAttribute("onClick", "editData(this)");
                    editCell.appendChild(editBtn);
                    row.appendChild(editCell);
                } else {
                    if( newest < data[i][data[i].length-2]){
                        newest = data[i][data[i].length-2];
                    }
                    row.setAttribute("alt", "Last Update: "+new Date(data[i][data[i].length-2]));
                    for (var j = 0; j < data[i].length; j++) {
                        var cell = document.createElement('td');
                        if(j == 0)
                            cell.setAttribute("onClick", "window.document.location='https://swgoh.gg"+data[i][data[i].length-1]+"'; ");
                        if(j < data[i].length-2){
                            cell.textContent = data[i][j];
                        } else if (j == data[i].length-2){
                            var btn = document.createElement('input');
                            btn.setAttribute("type", "button");
                            btn.setAttribute("value", "Show All Stats");
                            btn.setAttribute("id", "show-"+data[i][data[i].length-1]);
                            btn.setAttribute("onClick", "viewToggle(\"show-"+data[i][data[i].length-1]+"\");");
                            cell.appendChild(btn);
                        }
                        if(j != data[i].length-1)
                            row.appendChild(cell);
                    }
                }
            }
            table.appendChild(row);
        }
        // Add Count/Newest Record Info here
        var row = document.createElement('tr');

        var countLabelCell = document.createElement('td');
        countLabelCell.textContent = "# of Results:";
        row.appendChild(countLabelCell);
        var countCell = document.createElement('td');
        countCell.textContent = (data.length-1)/5;
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

function populateFilters(){
    
    var memberNames = [];
    var guildNames = [];

    var table = document.getElementById('memberTableBody');
    for (var i = 0, row; row = table.rows[i]; i++) {
        if(row.className != "P1_P2" && row.className != "P3_P4" && row.className != "P5_P6" && row.className != "totalRow"){
            var MemberNameCell = row.cells[0];
            if(!contains(MemberNameCell.innerHTML, memberNames)){
                memberNames.push(MemberNameCell.innerHTML);
            }
            var guildNameCell = row.cells[1];
            if(!contains(guildNameCell.innerHTML, guildNames)){
                guildNames.push(guildNameCell.innerHTML);
            }
        }
    }
    for(i = 0; i<memberNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', memberNames[i]);
        option.innerHTML = memberNames[i];
        document.getElementById('MemberName-input').appendChild(option);
    }
    for(i = 0; i<guildNames.length;i++){
        var option = document.createElement("option");
        option.setAttribute('value', guildNames[i]);
        option.innerHTML = guildNames[i];
        document.getElementById('guildName-input').appendChild(option);
    }
}

function viewToggle(id){
    if(id == "P1_P2" || id == "P3_P4" || id == "P5_P6"){
        if(document.getElementById(id).value.lastIndexOf("Show", 0) === 0){
            toggleViewByClass(id, 'show');
            if(id == "P1_P2")
                document.getElementById(id).value = 'Hide P1/P2'
            if(id == "P3_P4")
                document.getElementById(id).value = 'Hide P3/P4'
            if(id == "P5_P6")
                document.getElementById(id).value = 'Hide P5/P6'
        } else {
            toggleViewByClass(id, 'hide');
            if(id == "P1_P2")
                document.getElementById(id).value = 'Show P1/P2'
            if(id == "P3_P4")
                document.getElementById(id).value = 'Show P3/P4'
            if(id == "P5_P6")
                document.getElementById(id).value = 'Show P5/P6'
        }
    } else {
        var trimID = id.substring(5, id.length);
        if(id.lastIndexOf("show-", 0) === 0){
            if(document.getElementById(id).value == 'Show All Stats'){
                document.getElementById(trimID+'-1-H').style.display = 'table-row';
                document.getElementById(trimID+'-1-D').style.display = 'table-row';
                document.getElementById(trimID+'-2-H').style.display = 'table-row';
                document.getElementById(trimID+'-2-D').style.display = 'table-row';
                document.getElementById(trimID+'-3-H').style.display = 'table-row';
                document.getElementById(trimID+'-3-D').style.display = 'table-row';
                document.getElementById(id).value = 'Hide All Stats'
            } else {
                document.getElementById(trimID+'-1-H').style.display = 'none';
                document.getElementById(trimID+'-1-D').style.display = 'none';
                document.getElementById(trimID+'-2-H').style.display = 'none';
                document.getElementById(trimID+'-2-D').style.display = 'none';
                document.getElementById(trimID+'-3-H').style.display = 'none';
                document.getElementById(trimID+'-3-D').style.display = 'none';
                document.getElementById(id).value = 'Show All Stats'
            }
        }
    }
}

function editData(caller){
    var id = caller.id.substring(5, caller.id.length);
    if(caller.value == 'Edit'){
        var rowToEdit = document.getElementById(id);
        var children = rowToEdit.children;
        for (var i = 0; i < 6; i++) {
            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("placeholder", children[i].textContent);
            children[i].textContent = "";
            children[i].appendChild(input);
        }
        caller.value = "Cancel";
        document.getElementById('td-'+id).style.display = "table-cell";
    } else if(caller.value == 'Cancel'){
        var rowToEdit = document.getElementById(id);
        var children = rowToEdit.children;
        for (var i = 0; i < 6; i++) {
            var input = children[i].firstChild;
            children[i].textContent = input.placeholder;
        }
        caller.value = "Edit";
        document.getElementById('td-'+id).style.display = "none";
    }
}

function saveData(caller){
    var id = caller.id.substring(5, caller.id.length);
    var rowToEdit = document.getElementById(id);
    var children = rowToEdit.children;
    var data = [];
    for (var i = 0; i < 6; i++) {
        var input = children[i].firstChild;
        if(input.value != undefined && input.placeholder != input.value){
            data.push([id, i, input.value]);
            children[i].textContent = input.value;
        } else {
            children[i].textContent = input.placeholder;
        }
    }
    if(data.length > 0){
        pushToDB(data)
    }
    document.getElementById('td-'+id).style.display = "none";
}

function pushToDB (data) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", dbPushListener);
 
    // Determine the URL to send
    var url = "http://sithhappens.net/swgoh/dataPush?json="+encodeURIComponent(JSON.stringify(data));

    // Send the request
    oReq.open("GET", url);
    oReq.send();
}

function parseFilterInfo (guild) {
    var queries = [];
    if(document.getElementById('MemberName-input').selectedIndex != 0){
        queries.push("MemberName='"+escapeSingleQuote(document.getElementById('MemberName-input').value)+"'");
    }
    if(document.getElementById('guildName-input').selectedIndex != 0){
        queries.push("GuildName='"+escapeSingleQuote(document.getElementById('guildName-input').value)+"'");
    }
    var queryString = '';
    for(i=0;i<queries.length;i++){
        if(i == 0){
            queryString += queries[i];
        } else {
            queryString += " AND "+queries[i];
        }
    }

    // Erase the Table and write a wait message
    var table = document.getElementById('memberTableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    var table = document.getElementById('memberTableBody');
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

    sendDBReq('memberTable', guild, queryString);
}

function dbStandardListener () {
    var table = document.getElementById('memberTableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    populateStandardTable(this.responseText);
}

function dbPushListener () {
    alert("Saved Successfully");
}