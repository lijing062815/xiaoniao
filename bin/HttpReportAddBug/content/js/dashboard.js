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

    var data = {"OkPercent": 77.27272727272727, "KoPercent": 22.727272727272727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7045454545454546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "605 /zentaopms/www/js/kindeditor/kindeditor-min.js"], "isController": false}, {"data": [0.9, 500, 1500, "613 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "619 /success.txt"], "isController": false}, {"data": [1.0, 500, 1500, "607 /zentaopms/www/js/kindeditor/themes/default/default.png"], "isController": false}, {"data": [0.8, 500, 1500, "599 /zentaopms/www/index.php?m=user&f=login"], "isController": false}, {"data": [0.85, 500, 1500, "601 /zentaopms/www/index.php"], "isController": false}, {"data": [0.5, 500, 1500, "614 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "618 /success.txt"], "isController": false}, {"data": [1.0, 500, 1500, "602 /zentaopms/www/js/jquery/form/min.js"], "isController": false}, {"data": [1.0, 500, 1500, "604 /zentaopms/www/js/kindeditor/themes/default/default.css"], "isController": false}, {"data": [1.0, 500, 1500, "608 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "620 /success.txt"], "isController": false}, {"data": [1.0, 500, 1500, "600 /zentaopms/www/index.php"], "isController": false}, {"data": [0.9, 500, 1500, "609 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "617 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html"], "isController": false}, {"data": [0.8, 500, 1500, "616 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "611 /zentaopms/www/index.php"], "isController": false}, {"data": [0.95, 500, 1500, "610 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "606 /zentaopms/www/theme/zui/fonts/zenicon.woff"], "isController": false}, {"data": [1.0, 500, 1500, "603 /zentaopms/www/js/jquery/form/zentao.js"], "isController": false}, {"data": [0.8, 500, 1500, "612 /zentaopms/www/index.php?m=bug&f=create&productID=12&branch=0&extra=moduleID=0"], "isController": false}, {"data": [0.0, 500, 1500, "615 /success.txt"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 220, 50, 22.727272727272727, 8853.559090909093, 4, 42077, 42043.0, 42059.0, 42075.79, 1.1245029185962114, 13.202661581805032, 0.5852726216763272], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["605 /zentaopms/www/js/kindeditor/kindeditor-min.js", 10, 0, 0.0, 12.999999999999998, 12, 15, 14.9, 15.0, 15.0, 5.167958656330749, 478.32384528423773, 2.235747739018088], "isController": false}, {"data": ["613 /zentaopms/www/index.php", 10, 0, 0.0, 491.2, 446, 580, 572.5, 580.0, 580.0, 3.8580246913580245, 3.1421802662037037, 2.0307376060956788], "isController": false}, {"data": ["619 /success.txt", 10, 10, 100.0, 42047.4, 42014, 42077, 42075.4, 42077.0, 42077.0, 0.23147076524234989, 0.4821554123651683, 0.0], "isController": false}, {"data": ["607 /zentaopms/www/js/kindeditor/themes/default/default.png", 10, 0, 0.0, 4.9, 4, 6, 6.0, 6.0, 6.0, 5.192107995846314, 36.56785436137072, 2.1752093068535827], "isController": false}, {"data": ["599 /zentaopms/www/index.php?m=user&f=login", 10, 0, 0.0, 367.7, 115, 588, 585.0, 588.0, 588.0, 6.83526999316473, 6.1477379528366365, 4.84609962406015], "isController": false}, {"data": ["601 /zentaopms/www/index.php", 10, 0, 0.0, 433.0, 211, 518, 517.3, 518.0, 518.0, 4.701457451810061, 3.994402327221439, 2.4838754701457453], "isController": false}, {"data": ["614 /zentaopms/www/index.php", 10, 0, 0.0, 1022.2, 757, 1271, 1260.9, 1271.0, 1271.0, 3.481894150417827, 33.418703212047355, 3.403687543523677], "isController": false}, {"data": ["618 /success.txt", 10, 10, 100.0, 42039.9, 42013, 42072, 42070.5, 42072.0, 42072.0, 0.23166380947968307, 0.48255752501969146, 0.0], "isController": false}, {"data": ["602 /zentaopms/www/js/jquery/form/min.js", 10, 0, 0.0, 6.5, 5, 8, 8.0, 8.0, 8.0, 5.194805194805195, 74.91883116883116, 2.237215909090909], "isController": false}, {"data": ["604 /zentaopms/www/js/kindeditor/themes/default/default.css", 10, 0, 0.0, 6.2, 5, 7, 7.0, 7.0, 7.0, 5.186721991701245, 91.26908551607885, 2.365428877074689], "isController": false}, {"data": ["608 /zentaopms/www/index.php", 10, 0, 0.0, 472.7, 414, 490, 489.6, 490.0, 490.0, 4.152823920265781, 3.544500103820598, 2.080467452242525], "isController": false}, {"data": ["620 /success.txt", 10, 10, 100.0, 42056.0, 42028, 42076, 42075.9, 42076.0, 42076.0, 0.23166917641607784, 0.4825687043901309, 0.0], "isController": false}, {"data": ["600 /zentaopms/www/index.php", 10, 0, 0.0, 378.1, 141, 488, 487.2, 488.0, 488.0, 5.549389567147614, 4.519717674805771, 2.709662874583796], "isController": false}, {"data": ["609 /zentaopms/www/index.php", 10, 0, 0.0, 487.29999999999995, 468, 515, 514.8, 515.0, 515.0, 4.0600893219650835, 3.4653496751928543, 2.041939453917986], "isController": false}, {"data": ["617 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html", 10, 10, 100.0, 21022.899999999998, 21000, 21035, 21035.0, 21035.0, 21035.0, 0.45232495024425545, 0.942196405147458, 0.0], "isController": false}, {"data": ["616 /zentaopms/www/index.php", 10, 0, 0.0, 402.49999999999994, 135, 753, 736.6, 753.0, 753.0, 5.443658138268916, 48.05463646570495, 2.6580362003266194], "isController": false}, {"data": ["611 /zentaopms/www/index.php", 10, 0, 0.0, 486.0, 472, 500, 499.9, 500.0, 500.0, 3.9840637450199203, 3.3382096613545817, 1.9531250000000002], "isController": false}, {"data": ["610 /zentaopms/www/index.php", 10, 0, 0.0, 484.9, 465, 518, 515.3, 518.0, 518.0, 4.0, 3.4921875, 2.06640625], "isController": false}, {"data": ["606 /zentaopms/www/theme/zui/fonts/zenicon.woff", 10, 0, 0.0, 12.2, 12, 13, 13.0, 13.0, 13.0, 5.170630816959669, 419.4017822518097, 2.4338320837642193], "isController": false}, {"data": ["603 /zentaopms/www/js/jquery/form/zentao.js", 10, 0, 0.0, 6.1, 5, 7, 7.0, 7.0, 7.0, 5.1894135962636225, 47.1608231707317, 2.2500973015049297], "isController": false}, {"data": ["612 /zentaopms/www/index.php?m=bug&f=create&productID=12&branch=0&extra=moduleID=0", 10, 0, 0.0, 500.5, 482, 518, 517.6, 518.0, 518.0, 3.95882818685669, 3.347993368962787, 12.190407264449723], "isController": false}, {"data": ["615 /success.txt", 10, 10, 100.0, 42037.1, 42014, 42061, 42060.8, 42061.0, 42061.0, 0.23180343069077422, 0.48284835709318497, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 50, 100.0, 22.727272727272727], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 220, 50, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 50, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["619 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["618 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["620 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["617 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["615 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
