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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2608316486304356, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32585004359197905, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.33677504393673113, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.3392070484581498, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.30775899436497617, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.30060949063996517, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.3113746157224418, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.04270923209663503, 500, 1500, "Get transactions count grouped by status"], "isController": false}, {"data": [0.2808842652795839, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.3217713787085515, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.3025629887054735, 500, 1500, "Get top reviews"], "isController": false}, {"data": [0.002404897245299519, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 25227, 0, 0.0, 1775.9858484956605, 9, 8774, 1601.0, 3072.0, 3877.9500000000007, 5516.900000000016, 27.940466327900374, 294.81326470233165, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 2294, 0, 0.0, 1417.2201394943315, 19, 5871, 1379.0, 2303.0, 2649.75, 3661.6500000000024, 2.5589426903924752, 43.57949372827576, 0.0], "isController": false}, {"data": ["Get Product by ID", 2276, 0, 0.0, 1387.8418277680132, 10, 6885, 1335.5, 2196.9000000000005, 2539.15, 3544.9700000000007, 2.5510890325588904, 0.690117973156401, 0.0], "isController": false}, {"data": ["Get User by email", 2270, 0, 0.0, 1371.2440528634381, 9, 8467, 1316.0, 2238.7000000000003, 2598.7999999999993, 3579.3199999999997, 2.5514074889991627, 0.6719902067258248, 0.0], "isController": false}, {"data": ["get order entry by user id", 2307, 0, 0.0, 1481.5348938014745, 9, 5214, 1422.0, 2461.4000000000005, 2814.3999999999996, 3739.2400000000034, 2.5718776825230485, 0.2569691600428089, 0.0], "isController": false}, {"data": ["Get total products by category", 2297, 0, 0.0, 1490.5859817152816, 9, 5868, 1446.0, 2390.2000000000003, 2802.1, 3881.1, 2.561906227763167, 0.8381236194342393, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 2277, 0, 0.0, 1503.2529644268748, 13, 5238, 1433.0, 2477.0, 2831.0, 3807.0399999999936, 2.548567731797104, 20.846487618684126, 0.0], "isController": false}, {"data": ["Get transactions count grouped by status", 2318, 0, 0.0, 2490.392148403797, 500, 6558, 2407.0, 3473.999999999999, 3824.149999999999, 4650.86, 2.568139339839729, 0.11034973725873837, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 2307, 0, 0.0, 1544.8703944516683, 89, 6681, 1481.0, 2536.2000000000003, 2876.6, 3909.000000000002, 2.569468653484821, 145.990484109766, 0.0], "isController": false}, {"data": ["Get products in price range", 2292, 0, 0.0, 1436.2046247818505, 24, 6945, 1385.5, 2384.7000000000003, 2716.0499999999997, 3531.8700000000067, 2.5578073386304796, 68.97087522877422, 0.0], "isController": false}, {"data": ["Get top reviews", 2302, 0, 0.0, 1488.848392701999, 14, 6878, 1437.0, 2407.7000000000003, 2787.7, 3858.7399999999916, 2.567479999420031, 13.767610035952526, 0.0], "isController": false}, {"data": ["Get top selling products", 2287, 0, 0.0, 3917.66550065588, 607, 8774, 3715.0, 5552.200000000001, 5868.4, 6941.48, 2.5480531403334417, 1.0799365848678846, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 25227, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
