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
    cell.colSpan = 6;
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
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9435185185185185, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Home Concurso 1-18"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-19"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-16"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-17"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-14"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-15"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-12"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-13"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-10"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-11"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-20"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-9"], "isController": false}, {"data": [0.227, 500, 1500, "Home Concurso 1"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-2"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-4"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-25"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-3"], "isController": false}, {"data": [0.975, 500, 1500, "Home Concurso 1-6"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-23"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-5"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-24"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-8"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-21"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-7"], "isController": false}, {"data": [1.0, 500, 1500, "Home Concurso 1-22"], "isController": false}, {"data": [0.273, 500, 1500, "Home Concurso 1-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13500, 0, 0.0, 118.28696296296296, 0, 3372, 76.0, 1187.6999999999935, 2014.9899999999998, 513.4641716111364, 37385.73877034839, 199.01193804198994], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Home Concurso 1-18", 500, 0, 0.0, 4.518000000000001, 0, 135, 7.0, 12.949999999999989, 44.97000000000003, 20.29056083110137, 1788.7199382659687, 4.101705168005844], "isController": false}, {"data": ["Home Concurso 1-19", 500, 0, 0.0, 3.539999999999999, 0, 136, 5.0, 8.0, 33.0, 20.2930313730265, 1210.953829548683, 4.003117516944681], "isController": false}, {"data": ["Home Concurso 1-16", 500, 0, 0.0, 2.993999999999999, 0, 96, 5.0, 7.949999999999989, 27.99000000000001, 20.24701356549909, 30.92414962543025, 4.033584733751772], "isController": false}, {"data": ["Home Concurso 1-17", 500, 0, 0.0, 3.334000000000001, 0, 99, 5.0, 9.0, 42.79000000000019, 20.282330034074313, 72.71136089363945, 4.040620436475742], "isController": false}, {"data": ["Home Concurso 1-14", 500, 0, 0.0, 4.093999999999996, 0, 136, 6.0, 12.949999999999989, 47.940000000000055, 20.219993529602068, 410.0669976848107, 3.968963573681656], "isController": false}, {"data": ["Home Concurso 1-15", 500, 0, 0.0, 4.840000000000001, 0, 136, 7.0, 12.0, 93.0, 20.22653721682848, 347.07078655946606, 4.00975298341424], "isController": false}, {"data": ["Home Concurso 1-12", 500, 0, 0.0, 4.635999999999998, 0, 156, 7.0, 12.0, 42.97000000000003, 20.145044319097504, 1009.5539446514907, 4.013270547945205], "isController": false}, {"data": ["Home Concurso 1-13", 500, 0, 0.0, 6.306000000000006, 1, 154, 9.0, 15.0, 84.96000000000004, 20.18733850129199, 2230.8586179748063, 3.903411155523256], "isController": false}, {"data": ["Home Concurso 1-10", 500, 0, 0.0, 5.246, 0, 129, 7.0, 13.949999999999989, 85.90000000000009, 20.128824476650564, 1714.1934946155395, 3.6758693136070852], "isController": false}, {"data": ["Home Concurso 1-11", 500, 0, 0.0, 5.392000000000004, 0, 117, 7.900000000000034, 13.0, 93.99000000000001, 20.132066355290707, 1611.1354548337092, 3.8730635468674506], "isController": false}, {"data": ["Home Concurso 1-20", 500, 0, 0.0, 2.3120000000000007, 0, 40, 4.0, 6.949999999999989, 18.99000000000001, 20.298798311139983, 182.80812307161415, 4.043901226047418], "isController": false}, {"data": ["Home Concurso 1-9", 500, 0, 0.0, 3.636, 0, 116, 5.0, 10.0, 60.940000000000055, 20.129634848423848, 164.87035886106526, 4.088832078586095], "isController": false}, {"data": ["Home Concurso 1", 500, 0, 0.0, 1551.7580000000005, 159, 3372, 2065.8, 2094.85, 2718.5300000000034, 19.017191541153203, 18692.869385174195, 99.50596902099497], "isController": false}, {"data": ["Home Concurso 1-2", 500, 0, 0.0, 5.280000000000006, 0, 141, 8.0, 13.949999999999989, 106.91000000000008, 19.36708370453577, 591.0175768389046, 4.0852442189255145], "isController": false}, {"data": ["Home Concurso 1-1", 500, 0, 0.0, 8.421999999999995, 1, 152, 17.0, 43.0, 95.85000000000014, 19.365583485030402, 2690.983989503854, 3.876899037530501], "isController": false}, {"data": ["Home Concurso 1-4", 500, 0, 0.0, 2.8319999999999994, 0, 109, 5.0, 8.0, 19.980000000000018, 19.37608990505716, 30.78603347219531, 4.030378075954273], "isController": false}, {"data": ["Home Concurso 1-25", 500, 0, 0.0, 1.6939999999999993, 0, 31, 3.0, 5.0, 24.99000000000001, 20.338431500162706, 48.16474256630329, 3.535391413114221], "isController": false}, {"data": ["Home Concurso 1-3", 500, 0, 0.0, 2.8380000000000014, 0, 109, 5.0, 8.0, 19.0, 19.36858415649816, 94.42184776292852, 3.9342436567886887], "isController": false}, {"data": ["Home Concurso 1-6", 500, 0, 0.0, 140.78599999999986, 35, 2945, 140.0, 184.79999999999995, 2596.810000000005, 19.32815338822529, 439.9042410800572, 6.530801828443311], "isController": false}, {"data": ["Home Concurso 1-23", 500, 0, 0.0, 2.382000000000001, 0, 100, 4.900000000000034, 6.0, 25.940000000000055, 20.312817387771684, 141.73347679260615, 4.106204296160878], "isController": false}, {"data": ["Home Concurso 1-5", 500, 0, 0.0, 4.142000000000002, 0, 112, 6.0, 10.0, 46.91000000000008, 19.379093833572345, 1394.9541078834154, 3.841753953335142], "isController": false}, {"data": ["Home Concurso 1-24", 500, 0, 0.0, 1.7740000000000022, 0, 46, 4.0, 5.0, 17.960000000000036, 20.329335230737954, 53.94023810733889, 4.0499847529985775], "isController": false}, {"data": ["Home Concurso 1-8", 500, 0, 0.0, 6.842000000000004, 1, 123, 9.0, 15.949999999999989, 93.99000000000001, 20.119914691561707, 2233.074750513058, 3.5170554001851033], "isController": false}, {"data": ["Home Concurso 1-21", 500, 0, 0.0, 2.108, 0, 32, 4.0, 6.0, 14.990000000000009, 20.305393112410655, 166.13142919509423, 3.7477727521929824], "isController": false}, {"data": ["Home Concurso 1-7", 500, 0, 0.0, 5.016000000000003, 0, 137, 8.0, 13.0, 93.98000000000002, 20.093232599260567, 106.62756439881048, 3.8067257072817875], "isController": false}, {"data": ["Home Concurso 1-22", 500, 0, 0.0, 2.2719999999999976, 0, 35, 4.0, 6.0, 21.0, 20.30786726777954, 435.726710683969, 4.025876030624264], "isController": false}, {"data": ["Home Concurso 1-0", 500, 0, 0.0, 1404.7540000000013, 75, 2046, 1966.9, 1996.8, 2034.92, 19.06941266209001, 399.43342987223497, 3.612759820747521], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13500, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
