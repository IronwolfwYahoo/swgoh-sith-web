var debug = false;

function sendDBReq (caller, guild, queryString, sortID, macro) {
    var oReq = new XMLHttpRequest();

    // Determine what listener to use
    if(macro == undefined)
        oReq.addEventListener("load", dbStandardListener);
    else
        oReq.addEventListener("load", dbMacroListener);
    
    // Determine the URL to send
    var url = "http://sithhappens.net/swgoh/dataRetrieval?caller="+caller+"&guild="+guild;
    if(queryString != undefined) { url += "&queryString="+encodeURIComponent(queryString);}
    if(sortID != undefined){ url += "&sort="+sortID; }
    if(macro != undefined){ url += "&macro="+macro; }

    // Send the request
    oReq.open("GET", url);
    oReq.send();
}

function sendSSReq (batch, rangeInfo) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", SSStandardListener);

    // Determine the URL to send
    var url = "https://sheets.googleapis.com/v4/spreadsheets/1pegfgcK_c-srTUrnKOAomKs-VbyJWhuna8E-REX3wY4/values";
    var key = "&key=AIzaSyDikzvbbIgMb2NQf5EBFoUSm8LzB5emnE4";
    if(batch){
        url += ":batchGet?ranges="+rangeInfo+"&";
    } else {
        url += "/"+rangeInfo+"?"
    }
    url += key;

    // Send the request
    oReq.open("GET", url);
    oReq.send();
}

function getJSONData (type, params) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", jsonListener);
    
    // Determine the URL to send
    var url = "http://sithhappens.net/swgoh/jsonDataRetrieval?queryType="+type;
    if(params != undefined){
        for(var i=0; i<params.length;i++){
            url += "&"+params[i][0]+"="+encodeURIComponent(params[i][1]);
        }
    }
    // Send the request
    oReq.open("GET", url);
    oReq.send();
}

function contains(obj, array){
    var i = array.length;
    while (i--) {
        if (array[i] == obj) {
            return true;
        }
    }
    return false;
}

function findIndex(obj, array){
    var i = array.length;
    while (i--) {
        if (array[i] == obj) {
            return i;
        }
    }
    return -1;
}

function escapeSingleQuote(val){
    return val.replace(/'/g, "\\'");
}

function dateToString(date){
    var year = (date.getFullYear()+"").substring(2, 4);
    return forceTwoDigit(date.getMonth()+1)+"/"+forceTwoDigit(date.getDate())+"/"+year+" "+forceTwoDigit(date.getHours())+":"+forceTwoDigit(date.getMinutes())+":"+forceTwoDigit(date.getSeconds());
}

function forceTwoDigit(num){
    if(num < 10){
        return ("0"+num);
    } else {
        return num;
    }
}

function removeAllChildren(element){
    if(element.id != undefined)
        log('removeAllChildren(element) - Removing Children from: '+element.id);
    var i = 0;
    while (element.firstChild) {
        i++;
        log('removeAllChildren(element) - Removing Child '+i);
        element.removeChild(element.firstChild);
    }
    log('removeAllChildren(element) - Done, '+i+" Children removed");
}

function toggleViewByClass(token, action) {
    var elements = document.getElementsByTagName("tr");
    for(var item in elements){
        if(item.className == token){
            if(action === "show"){
                item.style.display = "table-row"
            } else {
                item.style.display = "none"
            }
        }
    }
}

function createElement(elementType, id, clazz, html){
  var element = document.createElement(elementType);
  if(id != undefined)
      element.id = id;
  if(clazz != undefined)
      element.setAttribute('class', clazz);
  if(html != undefined)
      element.innerHTML = html;
  return element;
}

function summaries(ids){
    if (!(this instanceof summaries))
        return new summaries(ids)
    this.ids = ids;
    for(var i=0; i< ids.length; i++){
        if(ids[i] != 'Member'){
            this[ids[i]] = new summary(ids[i])
        }
    }
    this.count = 0;
}

summaries.prototype.add = function(id, val){
    var sCount = this[id].add(val);
    if(sCount > this.count)
        this.count = sCount;
}

summaries.prototype.getValues = function(id){
    return this[id].getValues();
}

function summary(id){
    if (!(this instanceof summary))
        return new summary(id)
    this.id = id
    this.vals = [];
}

summary.prototype.add = function(val){
    if(this[val] == undefined){
        this[val] = 1;
        this.vals.push(val)
    } else {
        this[val] += 1;
    }
    return this.vals.length;
}

summary.prototype.getValues = function(){
    var ans = [];
    for(var i=0; i< this.vals.length; i++){
        var piece = [this.vals[i], this[this.vals[i]]];
        ans.push(piece);
    }
    ans.sort(summaryComparator)
    return ans;
}

function getSummaryBox(header, data, length){
    if(data != undefined){
        var divSummary = document.createElement('div');
        divSummary.setAttribute('class', 'infoPlate');
        divSummary.innerHTML = header+':';
        var uList = document.createElement('ul');
        var sumLen = data.length;
        if(data != ""){
            for(var i = 0; i < data.length; i++){
                var item = document.createElement('li');
                item.innerHTML = data[i][0] + " : " + data[i][1];
                uList.appendChild(item);
            }
        } else {
            sumLen = 1;
            var item = document.createElement('li');
            item.innerHTML = 'No Data Available';
            uList.appendChild(item);
        }
        if(sumLen < length){
            for(var i = 0; i < (length - data.length); i++){
                var itemS1 = document.createElement('li');
                itemS1.setAttribute('style', 'display:inline-block;');
                var itemS2 = document.createElement('li');
                itemS2.setAttribute('style', 'display:block;');
                uList.appendChild(itemS1);
                uList.appendChild(itemS2);
            }
        }
        divSummary.appendChild(uList);
        return(divSummary);
    }
}

function summaryComparator(a, b) {
    if(a[0] == b[0]) return 0;
    if(a[0] == 'Pending') return 1;
    if(b[0] == 'Pending') return -1;
    if(a[0] == 'Holder') return 1;
    if(b[0] == 'Holder') return -1;
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
}

function log(object){
    if(debug)
        console.log(object);
}