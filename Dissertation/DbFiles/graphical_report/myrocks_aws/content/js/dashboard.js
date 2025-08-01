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

    var data = {"OkPercent": 98.55606758832565, "KoPercent": 1.443932411674347};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1502816180235535, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20193285859613427, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.13431269674711438, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.16, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.13941825476429287, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.19250253292806485, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.13555787278415016, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.1984924623115578, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.16137295081967212, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.17623363544813697, 500, 1500, "Get top reviews"], "isController": false}, {"data": [0.0, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9765, 141, 1.443932411674347, 4605.045775729639, 8, 22076, 3809.0, 10000.0, 12688.899999999992, 16803.02, 10.74285789723821, 122.74454948136695, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 983, 11, 1.1190233977619533, 3504.7344862665295, 13, 10111, 3197.0, 7251.200000000001, 8002.0, 10001.0, 1.090400042595485, 17.83669030448007, 0.0], "isController": false}, {"data": ["Get Product by ID", 953, 10, 1.0493179433368311, 3772.0031479538275, 9, 10002, 3517.0, 7209.0, 8147.999999999999, 10000.46, 1.0687402994715736, 0.2819413203540637, 0.0], "isController": false}, {"data": ["Get User by email", 950, 1, 0.10526315789473684, 3622.7199999999953, 9, 10001, 3399.5, 6965.9, 7602.349999999999, 9251.950000000003, 1.0663816995430273, 0.27548997783609824, 0.0], "isController": false}, {"data": ["get order entry by user id", 997, 6, 0.6018054162487463, 3913.274824473415, 9, 10101, 3630.0, 7402.400000000001, 8093.9, 9825.139999999998, 1.1032007205660073, 0.11060988527874352, 0.0], "isController": false}, {"data": ["Get total products by category", 987, 18, 1.8237082066869301, 3711.0212765957453, 8, 10003, 3373.0, 7492.4, 8597.599999999999, 10001.0, 1.094950028344451, 0.3535505290455741, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 959, 19, 1.981230448383733, 3831.6558915537, 16, 10035, 3471.0, 7396.0, 8515.0, 10001.0, 1.073594391784708, 8.690860824831713, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 995, 8, 0.8040201005025126, 3335.858291457282, 20, 10001, 2885.0, 6894.2, 7668.399999999999, 9786.959999999992, 1.103503039901339, 62.250467385870614, 0.0], "isController": false}, {"data": ["Get products in price range", 976, 25, 2.5614754098360657, 3886.3493852459023, 20, 10058, 3513.0, 7588.600000000002, 8773.75, 10001.0, 1.082794986747965, 27.60724184325877, 0.0], "isController": false}, {"data": ["Get top reviews", 993, 12, 1.2084592145015105, 3533.252769385698, 14, 10002, 3061.0, 7274.8, 7965.7, 10001.0, 1.101251967115485, 5.986000911402449, 0.0], "isController": false}, {"data": ["Get top selling products", 972, 31, 3.1893004115226335, 12990.913580246915, 5580, 22076, 12696.0, 16804.1, 17676.0, 19657.96, 1.0723990736766849, 0.4432235473516046, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 141, 100.0, 1.443932411674347], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9765, 141, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 141, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get users who joined last 30 days", 983, 11, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Product by ID", 953, 10, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User by email", 950, 1, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["get order entry by user id", 997, 6, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get total products by category", 987, 18, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products by sorted category id", 959, 19, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 995, 8, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products in price range", 976, 25, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top reviews", 993, 12, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top selling products", 972, 31, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 31, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
