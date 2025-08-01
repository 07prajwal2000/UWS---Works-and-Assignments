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

    var data = {"OkPercent": 73.74126716453867, "KoPercent": 26.258732835461334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.003372681281618887, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.002824858757062147, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.002849002849002849, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.005050505050505051, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.015706806282722512, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.00554016620498615, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.002506265664160401, 500, 1500, "Get transactions count grouped by status"], "isController": false}, {"data": [0.0, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.0026666666666666666, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.0, 500, 1500, "Get top reviews"], "isController": false}, {"data": [0.0, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4151, 1090, 26.258732835461334, 10858.56901951337, 28, 39968, 10004.0, 14052.400000000001, 18593.999999999993, 28374.95999999999, 4.545459522852679, 16.074470328311172, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 380, 187, 49.21052631578947, 18559.297368421052, 10000, 31443, 20803.5, 28453.800000000003, 29368.25, 30741.91, 0.4280879788389353, 4.063956722488025, 0.0], "isController": false}, {"data": ["Get Product by ID", 354, 61, 17.231638418079097, 8109.514124293781, 28, 10150, 8715.0, 10004.0, 10007.25, 10092.9, 0.4237435226493307, 0.04452103141447743, 0.0], "isController": false}, {"data": ["Get User by email", 351, 68, 19.373219373219374, 8957.55555555556, 915, 11364, 9776.0, 10700.8, 10855.2, 11197.320000000002, 0.42907856905353337, 0.1033754830190017, 0.0], "isController": false}, {"data": ["get order entry by user id", 396, 67, 16.91919191919192, 9581.262626262629, 1040, 14809, 10003.0, 11172.1, 11367.65, 11812.27, 0.4351347104541114, 0.02153976050284431, 0.0], "isController": false}, {"data": ["Get total products by category", 382, 109, 28.534031413612567, 9117.753926701564, 49, 10224, 9610.5, 10007.0, 10013.0, 10138.550000000001, 0.428094664954288, 0.11154025931946396, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 361, 62, 17.174515235457065, 8383.15512465374, 106, 10265, 8979.0, 10006.0, 10013.0, 10129.18, 0.4275614900932463, 2.9035559406767315, 0.0], "isController": false}, {"data": ["Get transactions count grouped by status", 399, 67, 16.791979949874687, 10291.681704260664, 910, 13747, 10256.0, 12657.0, 12910.0, 13575.0, 0.438524184773649, 0.02222587430072428, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 392, 91, 23.214285714285715, 12642.948979591823, 2830, 39968, 12278.0, 15601.5, 18160.34999999999, 26434.25999999999, 0.43095392530864873, 0.02456731971669177, 0.0], "isController": false}, {"data": ["Get products in price range", 375, 131, 34.93333333333333, 9170.229333333327, 80, 10236, 9805.0, 10008.0, 10014.0, 10117.68, 0.43584632639659693, 8.397092505477136, 0.0], "isController": false}, {"data": ["Get top reviews", 389, 109, 28.020565552699228, 12656.904884318765, 9843, 15408, 13395.0, 14660.0, 14966.5, 15291.2, 0.42939394742187015, 1.1944588863574148, 0.0], "isController": false}, {"data": ["Get top selling products", 372, 138, 37.096774193548384, 11500.663978494618, 3499, 15577, 11488.0, 13946.5, 14278.35, 14880.559999999994, 0.4351457387300763, 0.03527745585376296, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1089, 99.90825688073394, 26.23464225487834], "isController": false}, {"data": ["53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268380130 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, 0.09174311926605505, 0.02409058058299205], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4151, 1090, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1089, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268380130 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get users who joined last 30 days", 380, 187, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 187, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Product by ID", 354, 61, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User by email", 351, 68, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["get order entry by user id", 396, 67, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 67, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get total products by category", 382, 109, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 109, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products by sorted category id", 361, 62, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get transactions count grouped by status", 399, 67, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 67, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 392, 91, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 91, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products in price range", 375, 131, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 131, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top reviews", 389, 109, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 109, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top selling products", 372, 138, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 137, "53200 0/org.postgresql.util.PSQLException: ERROR: root: memory budget exceeded: 92160 bytes requested, 268380130 currently allocated, 268435456 bytes in budget\\n  Hint: Consider increasing --max-sql-memory startup parameter.", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
