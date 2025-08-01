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

    var data = {"OkPercent": 78.4789644012945, "KoPercent": 21.521035598705502};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.01756819232547388, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.046296296296296294, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.030666666666666665, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.0049261083743842365, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.02756892230576441, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.03412073490813648, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.0, 500, 1500, "Get transactions count grouped by status"], "isController": false}, {"data": [0.03, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.023017902813299233, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.0, 500, 1500, "Get top reviews"], "isController": false}, {"data": [0.0, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4326, 931, 21.521035598705502, 10416.166435506218, 99, 34616, 10001.0, 14657.900000000001, 19150.94999999999, 21307.92, 4.73709453821541, 38.767260348501125, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 396, 140, 35.35353535353536, 16431.053030303025, 10000, 34616, 19166.5, 21222.1, 21519.75, 24879.25999999994, 0.4529384381172859, 5.001624173187188, 0.0], "isController": false}, {"data": ["Get Product by ID", 378, 62, 16.402116402116402, 7993.640211640212, 121, 10672, 8683.0, 10007.1, 10113.05, 10323.31, 0.4560541184220528, 0.11012541940691248, 0.0], "isController": false}, {"data": ["Get User by email", 375, 41, 10.933333333333334, 8086.533333333331, 415, 10746, 8748.0, 10134.4, 10407.8, 10692.720000000001, 0.4522305821232648, 0.11063279457094172, 0.0], "isController": false}, {"data": ["get order entry by user id", 406, 68, 16.748768472906406, 10987.034482758618, 1264, 24717, 10608.5, 14809.8, 15278.699999999999, 15958.12, 0.44685555669287264, 0.042288247148544254, 0.0], "isController": false}, {"data": ["Get total products by category", 399, 125, 31.328320802005013, 9052.015037593983, 152, 10342, 9813.0, 10026.0, 10114.0, 10280.0, 0.4542654845896981, 0.11539643700453468, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 381, 56, 14.698162729658792, 8155.658792650916, 99, 11493, 8605.0, 10001.0, 10002.0, 10277.44, 0.4547928722855669, 3.179549405904429, 0.0], "isController": false}, {"data": ["Get transactions count grouped by status", 416, 55, 13.221153846153847, 10059.384615384612, 2219, 17068, 10299.5, 12456.3, 12689.749999999998, 15380.57999999998, 0.4566716322388217, 0.022688641884912163, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 400, 77, 19.25, 9214.222499999993, 1104, 13521, 10000.0, 11086.6, 11237.5, 11705.890000000001, 0.44875297158608374, 20.681477489709533, 0.0], "isController": false}, {"data": ["Get products in price range", 391, 102, 26.08695652173913, 9019.826086956526, 148, 10501, 9555.0, 10009.4, 10143.4, 10375.32, 0.4548791312855629, 9.077109974591918, 0.0], "isController": false}, {"data": ["Get top reviews", 399, 93, 23.30827067669173, 12245.473684210527, 4184, 22912, 12674.0, 14057.0, 14342.0, 20596.0, 0.45380771973563144, 1.8877310872220712, 0.0], "isController": false}, {"data": ["Get top selling products", 385, 112, 29.09090909090909, 13082.358441558445, 5732, 22677, 13780.0, 15677.0, 16043.5, 21454.66, 0.4531560257392623, 0.14854699124996912, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 931, 100.0, 21.521035598705502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4326, 931, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 931, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get users who joined last 30 days", 396, 140, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 140, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Product by ID", 378, 62, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User by email", 375, 41, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["get order entry by user id", 406, 68, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get total products by category", 399, 125, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 125, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products by sorted category id", 381, 56, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get transactions count grouped by status", 416, 55, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 400, 77, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products in price range", 391, 102, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 102, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top reviews", 399, 93, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 93, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top selling products", 385, 112, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 112, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
