/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.64163614163614, "KoPercent": 1.3583638583638584};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.005341880341880342, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.007525083612040134, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.008605851979345954, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.012216404886561954, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.003316749585406302, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.011686143572621035, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.001692047377326565, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.0, 500, 1500, "Get transactions count grouped by status"], "isController": false}, {"data": [0.0, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.01423785594639866, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.0, 500, 1500, "Get top reviews"], "isController": false}, {"data": [0.0, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6552, 89, 1.3583638583638584, 6851.086080586078, 33, 19431, 6475.5, 10522.7, 11621.399999999998, 13531.870000000006, 7.23006435551789, 77.43213779882501, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 598, 1, 0.16722408026755853, 5423.478260869566, 221, 10095, 5539.0, 7697.0, 8513.349999999988, 9695.419999999998, 0.680474147103035, 12.3654855856544, 0.0], "isController": false}, {"data": ["Get Product by ID", 581, 0, 0.0, 5725.893287435458, 33, 10073, 5693.0, 7807.6, 8585.199999999999, 9907.779999999999, 0.6857852418071682, 0.07366833652225438, 0.0], "isController": false}, {"data": ["Get User by email", 573, 0, 0.0, 5675.020942408388, 767, 10111, 5739.0, 7660.0, 8279.8, 9405.239999999998, 0.6836003908333125, 0.17987454314794998, 0.0], "isController": false}, {"data": ["get order entry by user id", 603, 5, 0.8291873963515755, 5739.396351575456, 309, 10012, 5557.0, 7877.8, 8508.0, 9985.920000000002, 0.6702383069535836, 0.0349266978953628, 0.0], "isController": false}, {"data": ["Get total products by category", 599, 0, 0.0, 5036.749582637727, 1206, 10438, 5058.0, 7140.0, 7840.0, 9187.0, 0.6784076108499915, 0.22193998987768276, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 591, 5, 0.8460236886632826, 6387.187817258883, 956, 11002, 6343.0, 8794.800000000005, 9618.8, 10338.16, 0.6891437127005338, 5.589836616969027, 0.0], "isController": false}, {"data": ["Get transactions count grouped by status", 615, 13, 2.113821138211382, 8764.134959349587, 1699, 14481, 8692.0, 11307.0, 12009.199999999999, 13072.76, 0.6792802942443421, 0.03031823315329644, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 602, 2, 0.33222591362126247, 10056.36212624584, 5924, 16106, 9883.5, 12440.8, 13361.500000000002, 15565.840000000013, 0.6658518645511307, 37.73240352337395, 0.0], "isController": false}, {"data": ["Get products in price range", 597, 2, 0.33500837520938026, 5116.520938023452, 1094, 10294, 5134.0, 7408.0, 8426.3, 9805.079999999996, 0.6874506290691434, 20.252884915856388, 0.0], "isController": false}, {"data": ["Get top reviews", 600, 1, 0.16666666666666666, 6960.261666666663, 2767, 12518, 6919.0, 9425.8, 9920.199999999999, 11183.8, 0.6738203931741995, 2.5726471385093967, 0.0], "isController": false}, {"data": ["Get top selling products", 593, 60, 10.118043844856661, 10352.875210792574, 4180, 19431, 10363.0, 13061.8, 13993.799999999992, 17736.93999999999, 0.6848887893060333, 0.05623980571044796, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 38, 42.69662921348315, 0.57997557997558], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268394928 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 2, 2.247191011235955, 0.030525030525030524], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268364467 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268356743 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268364832 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268405168 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268405996 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268368896 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 40960 bytes requested, 268433831 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268361431 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268408147 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268361432 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/131/1: root: memory budget exceeded: 4198400 bytes requested, 266968791 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268428736 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268420096 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268418496 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268409856 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268399615 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268415407 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268377223 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268415720 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/131/1: root: memory budget exceeded: 4198400 bytes requested, 265148848 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268364520 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268354172 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268415408 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268354592 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 40960 bytes requested, 268418958 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268428736 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/131/1: root: memory budget exceeded: 2099200 bytes requested, 266708103 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268426002 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 40960 bytes requested, 268425905 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268412632 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268367391 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268357260 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268374394 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/131/1: root: memory budget exceeded: 2099200 bytes requested, 267734016 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268392356 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268384688 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268367607 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268405479 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268405372 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268358602 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268415720 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 81920 bytes requested, 268418184 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268426272 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/135/1: root: memory budget exceeded: 2099200 bytes requested, 268085209 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/131/1: root: memory budget exceeded: 2099200 bytes requested, 267882928 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268351762 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268344039 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268387776 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268405791 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 1.1235955056179776, 0.015262515262515262], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6552, 89, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 38, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268394928 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 2, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268364467 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268356743 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268364832 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get users who joined last 30 days", 598, 1, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["get order entry by user id", 603, 5, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get products by sorted category id", 591, 5, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get transactions count grouped by status", 615, 13, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 9, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 40960 bytes requested, 268433831 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 40960 bytes requested, 268418958 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 40960 bytes requested, 268425905 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: scan with start key /Table/135/1: root: memory budget exceeded: 2099200 bytes requested, 268085209 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 602, 2, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products in price range", 597, 2, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top reviews", 600, 1, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top selling products", 593, 60, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 13, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268394928 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 2, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268364467 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268356743 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268364832 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
