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

    var data = {"OkPercent": 99.57725213890286, "KoPercent": 0.42274786109713136};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15888273779567186, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.22238955823293172, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.12551440329218108, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.1611740473738414, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.17419038272816487, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.2295, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.10809426229508197, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.18571428571428572, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.171875, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.20576540755467196, 500, 1500, "Get top reviews"], "isController": false}, {"data": [0.0, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9935, 42, 0.42274786109713136, 4520.219224962257, 0, 19994, 3608.0, 9402.4, 12792.199999999993, 16597.64, 10.97182664624335, 126.92079655696129, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 996, 8, 0.8032128514056225, 3373.4136546184736, 2, 10006, 2806.5, 7232.800000000006, 8200.3, 9700.449999999993, 1.1038506210822168, 18.34502705459184, 0.0], "isController": false}, {"data": ["Get Product by ID", 972, 6, 0.6172839506172839, 3867.063786008232, 0, 10002, 3593.5, 7301.1, 8298.7, 9525.839999999998, 1.0892599196054458, 0.2880739486456532, 0.0], "isController": false}, {"data": ["Get User by email", 971, 2, 0.2059732234809475, 3448.9969104016436, 1, 10004, 2999.0, 6894.8, 7707.4, 9027.399999999998, 1.0885064480835112, 0.2810608022914686, 0.0], "isController": false}, {"data": ["get order entry by user id", 1019, 3, 0.2944062806673209, 3407.0127576054924, 1, 10001, 2901.0, 6699.0, 7694.0, 9277.199999999995, 1.1282570255867437, 0.051438147100800184, 0.0], "isController": false}, {"data": ["Get total products by category", 1000, 5, 0.5, 3250.4439999999963, 1, 10002, 2502.0, 7099.9, 8198.95, 9202.0, 1.108885946644844, 0.36147624357400593, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 976, 3, 0.3073770491803279, 4196.706967213114, 1, 10001, 4194.5, 7731.800000000006, 8198.3, 8899.23, 1.092027972027972, 8.989295236013986, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 1015, 1, 0.09852216748768473, 3522.1891625615735, 11, 10000, 3003.0, 7196.8, 8199.8, 9103.720000000001, 1.1242638287220057, 63.833544605859686, 0.0], "isController": false}, {"data": ["Get products in price range", 992, 3, 0.3024193548387097, 3783.087701612901, 1, 10001, 3495.5, 7300.5, 8205.4, 9299.35, 1.0999758271441211, 28.693112357762704, 0.0], "isController": false}, {"data": ["Get top reviews", 1006, 1, 0.09940357852882704, 3476.009940357851, 3, 10000, 2789.0, 7426.100000000007, 8264.149999999998, 9190.349999999995, 1.1148790921382183, 6.126931306727508, 0.0], "isController": false}, {"data": ["Get top selling products", 988, 10, 1.0121457489878543, 12953.247975708495, 8094, 19994, 12799.0, 16598.1, 17298.1, 18516.350000000002, 1.09271849116369, 0.47003726911068416, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 42, 100.0, 0.42274786109713136], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9935, 42, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 42, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get users who joined last 30 days", 996, 8, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Product by ID", 972, 6, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User by email", 971, 2, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["get order entry by user id", 1019, 3, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get total products by category", 1000, 5, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products by sorted category id", 976, 3, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 1015, 1, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get products in price range", 992, 3, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top reviews", 1006, 1, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get top selling products", 988, 10, "null 0/java.sql.SQLException: Cannot get a connection, pool error Timeout waiting for idle object, borrowMaxWaitDuration=PT10S", 10, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
