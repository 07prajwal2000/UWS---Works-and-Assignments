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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2841065399524822, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39513538320330427, 500, 1500, "Get users who joined last 30 days"], "isController": false}, {"data": [0.2956221198156682, 500, 1500, "Get Product by ID"], "isController": false}, {"data": [0.30927121771217714, 500, 1500, "Get User by email"], "isController": false}, {"data": [0.34511861313868614, 500, 1500, "get order entry by user id"], "isController": false}, {"data": [0.413302752293578, 500, 1500, "Get total products by category"], "isController": false}, {"data": [0.24930939226519336, 500, 1500, "Get products by sorted category id"], "isController": false}, {"data": [0.05371713508612874, 500, 1500, "Get transactions count grouped by status"], "isController": false}, {"data": [0.3402745995423341, 500, 1500, "Get orders who has ordered 250 pounds"], "isController": false}, {"data": [0.338613406795225, 500, 1500, "Get products in price range"], "isController": false}, {"data": [0.38616582684379297, 500, 1500, "Get top reviews"], "isController": false}, {"data": [6.887052341597796E-4, 500, 1500, "Get top selling products"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23991, 0, 0.0, 1867.5043974823805, 0, 9288, 1691.0, 3593.0, 4407.950000000001, 5804.0, 26.58497584846198, 279.87299933609586, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get users who joined last 30 days", 2179, 0, 0.0, 1393.8026617714565, 1, 8102, 1205.0, 2705.0, 3008.0, 4104.0, 2.427146615695474, 41.33497053819665, 0.0], "isController": false}, {"data": ["Get Product by ID", 2170, 0, 0.0, 1607.2557603686637, 0, 6892, 1504.0, 2790.5000000000005, 3099.0, 4003.29, 2.430144543205618, 0.65725059731721, 0.0], "isController": false}, {"data": ["Get User by email", 2168, 0, 0.0, 1544.975553505535, 1, 5392, 1503.0, 2597.0, 3001.5499999999997, 3932.449999999995, 2.433674511749664, 0.6411324423237101, 0.0], "isController": false}, {"data": ["get order entry by user id", 2192, 0, 0.0, 1443.354470802919, 1, 5296, 1305.0, 2598.7, 2939.649999999993, 3871.190000000003, 2.436251240632047, 0.2437100007307642, 0.0], "isController": false}, {"data": ["Get total products by category", 2180, 0, 0.0, 1328.7899082568783, 1, 5195, 1188.5, 2588.9, 2898.0, 3704.38, 2.428246972766876, 0.7943972030047886, 0.0], "isController": false}, {"data": ["Get products by sorted category id", 2172, 0, 0.0, 1728.336095764274, 1, 8002, 1702.0, 2888.4, 3205.35, 4201.27, 2.4277650477840496, 19.858359414296093, 0.0], "isController": false}, {"data": ["Get transactions count grouped by status", 2206, 0, 0.0, 2762.9383499546675, 596, 7903, 2602.0, 4287.0, 4702.0, 5897.86, 2.4446761801436, 0.1050446796155453, 0.0], "isController": false}, {"data": ["Get orders who has ordered 250 pounds", 2185, 0, 0.0, 1480.0022883295194, 7, 6695, 1308.0, 2702.0, 3093.0, 4013.439999999988, 2.428768175467107, 137.9962511883318, 0.0], "isController": false}, {"data": ["Get products in price range", 2178, 0, 0.0, 1540.1423324150587, 1, 5807, 1497.0, 2796.1000000000004, 3101.0, 4191.05, 2.431750760061676, 65.57177928400684, 0.0], "isController": false}, {"data": ["Get top reviews", 2183, 0, 0.0, 1369.430142006414, 2, 7592, 1198.0, 2590.0, 2992.5999999999995, 3816.439999999988, 2.4294805163007793, 13.027614760749588, 0.0], "isController": false}, {"data": ["Get top selling products", 2178, 0, 0.0, 4335.016528925619, 997, 9288, 4228.0, 5809.0, 6302.0, 7723.1600000000035, 2.4236866967643005, 1.027226588277057, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23991, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
