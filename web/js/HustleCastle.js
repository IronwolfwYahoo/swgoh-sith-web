// <editor-fold defaultstate="collapsed" desc="Object Definitions">
function portal(lvl){
    if (!(this instanceof portal))
        return new portal(lvl)
    this.lvl = lvl;
    for(var i = 0; i<missions.length;i++){
        if(lvl == missions[i][0]){
            this.foodCost = missions[i][1];
            this.modifiedRewards = [missions[i][2], missions[i][2]*2, missions[i][2]*3];
            break;
        }
    }
}

function throne(lvl){
    if (!(this instanceof throne))
        return new throne(lvl)
    this.lvl = lvl;
    for(var i = 0; i<costs.length;i++){
        if(lvl == costs[i][0]){
            this.goblinCost = costs[i][1][1] + costs[i][1][2];
            this.x2RecoupCosts = costs[i][2][0];
            this.x3RecoupCosts = costs[i][2][1];
            break;
        }
    }
}
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc="Static Values">
// Portal level, Food Cost, Soul Reward
var missions = [
  [20, 14100, 38], [19, 13700, 36],
  [18, 13300, 34], [17, 12900, 32], [16, 12500, 30],
  [15, 12200, 29], [14, 11900, 27], [13, 11700, 26],
  [12, 11400, 25], [11, 11100, 23], [10, 10800, 22],
  [9, 10500, 21], [8, 10200, 19], [7, 10000, 18],
  [6, 9700, 17], [5, 9400, 15], [4, 9100, 14],
  [3, 8800, 13], [2, 8500, 11], [1, 8300, 10]
];

// Time Periods
var times = [24, 36, 48, 60];

// Multipliers
var multis = [1, 2, 3];

// Throne Room level, Diamond Soul Cost(10, 50, 100, 250), Multiplier Diamond Cost
var costs = [
/* 2x Recoup Strategies (180d): 100d + 50d + 10d + 10d + 10d
   3x Recoup Strategies (490d): 250d + 250d */
    [7, [260, 1234, 2389, 5779], [5779, 17337]],
/* 2x Recoup Strategies (180d): 100d + 50d + 10d + 10d + 10d
   3x Recoup Strategies (490d): 250d + 250d */
    [6, [152, 721, 1396, 3376], [2573, 6752]]
];
// </editor-fold>

var portalStats;
var throneStats;

function displaySummaryOutput(){
  removeAllChildren(document.getElementById("output"));
  portalStats = new portal(document.getElementById('portalLvl').value);
  throneStats = new throne(document.getElementById('throneLvl').value);
  
  var stats = runMissionNumbers();
  var output = document.getElementById("output");
  
  output.appendChild(createDiv("Soul Stealer Recommendations based on time the portal is open"));
  var table = document.createElement('table');
  table.appendChild(createHeaderRow(["Period", "Soul Stealer", "Purchase 3 Day Goblin", "Approximate Souls for Gear"]));
  var tbody = document.createElement('tbody');
  
  for(var i = 0;i<times.length;i++){
      var tr = document.createElement('tr');
      tr.appendChild(createCell(times[i]+" Hours"));
      tr.appendChild(createCell(stats[i][0]));
      tr.appendChild(createCell(stats[i][1]));
      tr.appendChild(createCell(stats[i][2]));
      tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  output.appendChild(table);
}

function runMissionNumbers(){
  var foodForRecoup = foodNeeded();
  var hoursNeeded = [0, round((foodForRecoup[0] - document.getElementById("initialFood").value)/document.getElementById("foodPerHour").value, 2),
                    round((foodForRecoup[1] - document.getElementById("initialFood").value)/document.getElementById("foodPerHour").value, 2)];
  var roi = calcBestROI(hoursNeeded);
  return roi;
}

function foodNeeded(){
    return [throneStats.x2RecoupCosts * portalStats.foodCost / portalStats.modifiedRewards[1], throneStats.x3RecoupCosts * portalStats.foodCost / portalStats.modifiedRewards[2]];
}

function calcBestROI(hoursNeeded){
  // Goblin Usage
  var gu = [];
  // Final Answer
  var roi = [];

  // Hours spent sleeping each day
  var hoursSleeping = document.getElementById('hoursSleeping').value;
  // Dining Hall Storage
  var dhs = document.getElementById('dhStorage').value;

    // Food Cost Per Soul (lvlcost/lvlreward*Soul Stealer Modifier = FoodCostPerSoul)
  var fcps = [portalStats.foodCost/portalStats.modifiedRewards[0], portalStats.foodCost/portalStats.modifiedRewards[1], portalStats.foodCost/portalStats.modifiedRewards[2]];

    //FoodWastedPerPeriod = hoursSleeping * FoodPerHour - DiningHallStorage");
  var fwpp = (hoursSleeping*document.getElementById("foodPerHour").value)-dhs;
  
  for(var i=0;i<times.length;i++){
      console.log("************************ "+times[i]+" Period Numbers ************************");
    // Initial population of array with hours available after costs are recouped
    var perModifierNumbers = [times[i] - hoursNeeded[0], times[i] - hoursNeeded[1], times[i] - hoursNeeded[2]];

    // Souls Received after Recoup == ((FPH x #Hours = Food Generated) / Cost of Run = # of Runs) x Souls Per Run
    for (var j=0; j<perModifierNumbers.length;j++){

      // totalHours = Hours Portal is Open; fcps = FoodCostPerSoul w/Modifier included; fwpp = Food Wasted Per Period
      var goblinData = goblinEfficiencyCheck(times[i], fcps[j], fwpp); // Return Value: Array ["Hours Lost if any", "Efficient: Yes/No"];
      console.log("After recoup we have "+perModifierNumbers[j]+" hours of farming - "+goblinData[0]+" hours lost to sleep");
      perModifierNumbers[j] = perModifierNumbers[j]-goblinData[0];
      gu[j] = goblinData[1];
  
      var foodEarned = document.getElementById("foodPerHour").value*perModifierNumbers[j];
      console.log("  - Food Per Hour: "+document.getElementById("foodPerHour").value+" X Number of Hours Left: "+perModifierNumbers[j]+" = "+foodEarned+" food");
      
      var runs = Math.floor(foodEarned/portalStats.foodCost);
      console.log("  - Divided by cost of level: "+portalStats.foodCost+" = "+runs+" runs");

      var tSouls = runs*portalStats.modifiedRewards[j];
      console.log("  - Total Souls = "+tSouls);

      if(goblinData[1] == "Yes"){
        perModifierNumbers[j] = tSouls - throneStats.goblinCost;
      } else {
        perModifierNumbers[j] = tSouls;
      }
      console.log("  - After Goblin Cost Removed = "+perModifierNumbers[j]);
      
    }
    var index;
    if(times[i] == 24)
      index = 0;
    if(times[i] == 36)
      index = 1;
    if(times[i] == 48)
      index = 2;
    if(times[i] == 60)
      index = 3;
    
    if(perModifierNumbers[0] > perModifierNumbers[1] && perModifierNumbers[0] > perModifierNumbers[2])
      roi[i] = ["N/A", gu[0], perModifierNumbers[0]];
    else if(perModifierNumbers[1] > perModifierNumbers[2])
      roi[i] = ["x2", gu[1], perModifierNumbers[1]];
    else
      roi[i] = ["x3", gu[2], perModifierNumbers[2]];
  }
  return roi;
}

function goblinEfficiencyCheck(hrs, fcps, fwpp){ // Return Value: Array ["Hours Lost if any", "Efficient: Yes/No"];
  if(fwpp <= 0){
    // Array ["Hours Lost if any", "Efficient: Yes/No"];
    return [0, "No"];
  }

  // Number of periods where food is lost = 1 every 24 hours
  var periods = Math.floor(hrs/24);
  // SoulsSavedPerPeriod = FoodWastePerPeriod/FoodCostPerSoul
  var sspp = Math.floor(fwpp/fcps);

  // If Souls Saved per Period * Number of Periods is Greater than the 3 day Goblin Cost in Souls
  if(sspp*periods > throneStats.goblinCost)
    return [0, "Yes"];
  else
    return [document.getElementById('hoursSleeping').value-(document.getElementById('dhStorage').value/document.getElementById("foodPerHour").value),"No"]; // Hours lost = Hours spent sleeping - Hours filling Storage(DiningHallStorage/FoodPerHour);
}

function round(value, decimals) {
  return Number(Math.ceil(value+'e'+decimals)+'e-'+decimals);
}

// <editor-fold defaultstate="collapsed" desc="HTML Display Management Functions">
function toggleVisibility(id, displayType){
  var element = document.getElementById(id);
  if(element.style.display == "none"){
    element.style.display = displayType;
  } else {
    element.style.display = "none";
  }
}

function populateSelects(){
  var pLvlSelect = document.getElementById('portalLvl');
  try {
    for(var i=0, lvl; lvl = missions[i][0]; i++){
      pLvlSelect.appendChild(createOption(lvl));
    }
  } catch (err) {}
  var tLvlSelect = document.getElementById('throneLvl');
  try {
    for(var i=0, lvl; lvl = costs[i][0]; i++){
      tLvlSelect.appendChild(createOption(lvl));
    }
  } catch (err) {}
  var sleepSelect = document.getElementById('hoursSleeping');
  for(var i=0; i<25;i++){
    sleepSelect.appendChild(createOption(i));
  }
}

function createElement(element, value){
  var element = document.createElement(element);
  element.innerHTML = value;
  return element;
}
function createDiv(value){
  return createElement('div', value);
}
function createSpan(value){
  return createElement('span', value);
}
function createOption(value){
  var option = document.createElement("option");
  option.value = value;
  option.innerHTML = value;
  return option;
}
function createHeaderRow(headers){
  var thead = document.createElement("thead");
  for(var i=0;i<headers.length;i++){
    var th = document.createElement("th");
    th.innerHTML = headers[i];
    thead.appendChild(th);
  }
  return thead;
}
function createCell(value){
  var td = document.createElement("td");
  td.innerHTML = value;
  return td;
}
function removeAllChildren(element){
    var i = 0;
    while (element.firstChild) {
        i++;
        element.removeChild(element.firstChild);
    }
}
// </editor-fold>

