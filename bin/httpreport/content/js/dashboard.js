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

    var data = {"OkPercent": 88.23529411764706, "KoPercent": 11.764705882352942};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "3 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "44 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "17 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "30 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "32 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "40 /zentaopms/www/js/kindeditor/lang/zh_CN.js"], "isController": false}, {"data": [1.0, 500, 1500, "12 /zentaopms/www/js/jquery/tablesorter/min.js"], "isController": false}, {"data": [1.0, 500, 1500, "15 /zentaopms/www/theme/zui/fonts/zenicon.woff"], "isController": false}, {"data": [1.0, 500, 1500, "20 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "51 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html"], "isController": false}, {"data": [1.0, 500, 1500, "29 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "11 /zentaopms/www/theme/default/index.css"], "isController": false}, {"data": [1.0, 500, 1500, "37 /zentaopms/www/js/jquery/form/zentao.js"], "isController": false}, {"data": [1.0, 500, 1500, "13 /zentaopms/www/js/jquery/tablesorter/metadata.js"], "isController": false}, {"data": [1.0, 500, 1500, "34 /zentaopms/www/index.php"], "isController": false}, {"data": [0.5, 500, 1500, "48 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "10 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "22 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "19 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "7 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html"], "isController": false}, {"data": [1.0, 500, 1500, "28 /zentaopms/www/js/chartjs/chart.line.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "24 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "25 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "39 /zentaopms/www/js/kindeditor/kindeditor-min.js"], "isController": false}, {"data": [0.9, 500, 1500, "50 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "6 /zentaopms/www/js/md5.js"], "isController": false}, {"data": [1.0, 500, 1500, "26 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "42 /zentaopms/www/theme/zui/css/min.css"], "isController": false}, {"data": [1.0, 500, 1500, "46 /zentaopms/www/index.php?m=bug&f=create&productID=12&branch=0&extra=moduleID=0"], "isController": false}, {"data": [1.0, 500, 1500, "31 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "14 /zentaopms/www/theme/default/fonts/zenicon.woff"], "isController": false}, {"data": [1.0, 500, 1500, "41 /zentaopms/www/js/kindeditor/themes/default/default.png"], "isController": false}, {"data": [0.0, 500, 1500, "1 /success.txt"], "isController": false}, {"data": [1.0, 500, 1500, "36 /zentaopms/www/js/jquery/form/min.js"], "isController": false}, {"data": [1.0, 500, 1500, "45 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "33 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "21 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "47 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "18 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "2 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "8 /zentaopms/www/favicon.ico"], "isController": false}, {"data": [1.0, 500, 1500, "23 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "35 /zentaopms/www/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "4 /favicon.ico"], "isController": false}, {"data": [1.0, 500, 1500, "16 /zentaopms/www/theme/default/images/main/icon.png"], "isController": false}, {"data": [1.0, 500, 1500, "38 /zentaopms/www/js/kindeditor/themes/default/default.css"], "isController": false}, {"data": [1.0, 500, 1500, "5 /zentaopms/www/theme/default/zh-cn.default.css"], "isController": false}, {"data": [0.0, 500, 1500, "49 /success.txt"], "isController": false}, {"data": [0.8, 500, 1500, "9 /zentaopms/www/index.php?m=user&f=login&referer=L3plbnRhb3Btcy93d3cvaW5kZXgucGhwP209bXkmZj1pbmRleA=="], "isController": false}, {"data": [1.0, 500, 1500, "43 /zentaopms/www/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "27 /zentaopms/www/theme/default/images/main/green.png"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 510, 60, 11.764705882352942, 2701.9647058823516, 3, 42329, 565.900000000001, 21025.25, 42169.59, 3.6813535831841544, 48.55654199314618, 2.087721670720968], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["3 /zentaopms/www/index.php", 10, 0, 0.0, 347.29999999999995, 140, 477, 473.8, 477.0, 477.0, 11.961722488038278, 104.43611692583733, 7.4643951854066986], "isController": false}, {"data": ["44 /zentaopms/www/index.php", 10, 0, 0.0, 400.3, 374, 427, 426.3, 427.0, 427.0, 6.858710562414266, 5.465534979423868, 4.04556755829904], "isController": false}, {"data": ["17 /zentaopms/www/index.php", 10, 0, 0.0, 395.7, 388, 418, 416.6, 418.0, 418.0, 7.429420505200594, 5.688150074294205, 4.0484537518573545], "isController": false}, {"data": ["30 /zentaopms/www/index.php", 10, 0, 0.0, 398.20000000000005, 383, 411, 410.8, 411.0, 411.0, 7.262164124909224, 5.361519607843137, 4.077875363108206], "isController": false}, {"data": ["32 /zentaopms/www/index.php", 10, 0, 0.0, 389.79999999999995, 375, 402, 402.0, 402.0, 402.0, 7.107320540156361, 5.4693052594172, 3.8798751776830134], "isController": false}, {"data": ["40 /zentaopms/www/js/kindeditor/lang/zh_CN.js", 10, 0, 0.0, 6.2, 4, 10, 9.8, 10.0, 10.0, 9.643201542912246, 80.18736439247832, 4.972275795564127], "isController": false}, {"data": ["12 /zentaopms/www/js/jquery/tablesorter/min.js", 10, 0, 0.0, 7.7, 6, 9, 9.0, 9.0, 9.0, 10.37344398340249, 325.68967193983406, 5.0246369294605815], "isController": false}, {"data": ["15 /zentaopms/www/theme/zui/fonts/zenicon.woff", 10, 0, 0.0, 13.799999999999999, 11, 19, 18.8, 19.0, 19.0, 10.298661174047375, 835.348143022657, 5.742710478887744], "isController": false}, {"data": ["20 /zentaopms/www/index.php", 10, 0, 0.0, 404.19999999999993, 388, 416, 415.9, 416.0, 416.0, 7.24112961622013, 5.543989862418537, 3.945849927588704], "isController": false}, {"data": ["51 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html", 10, 10, 100.0, 21018.1, 21000, 21034, 21033.6, 21034.0, 21034.0, 0.46352090479280617, 0.9655176659404838, 0.0], "isController": false}, {"data": ["29 /zentaopms/www/index.php", 10, 0, 0.0, 392.80000000000007, 385, 417, 415.2, 417.0, 417.0, 7.251631617113851, 5.382070340826686, 4.071961113125453], "isController": false}, {"data": ["11 /zentaopms/www/theme/default/index.css", 10, 10, 100.0, 3.8, 3, 5, 5.0, 5.0, 5.0, 10.40582726326743, 2.54048517169615, 5.1419419875130075], "isController": false}, {"data": ["37 /zentaopms/www/js/jquery/form/zentao.js", 10, 0, 0.0, 6.0, 4, 10, 9.8, 10.0, 10.0, 9.70873786407767, 88.23194781553399, 5.05347390776699], "isController": false}, {"data": ["13 /zentaopms/www/js/jquery/tablesorter/metadata.js", 10, 0, 0.0, 4.9, 3, 8, 7.800000000000001, 8.0, 8.0, 10.40582726326743, 42.85290387617066, 5.091132284079085], "isController": false}, {"data": ["34 /zentaopms/www/index.php", 10, 0, 0.0, 387.8, 376, 400, 399.8, 400.0, 400.0, 7.178750897343861, 5.440147164393395, 4.115162867910984], "isController": false}, {"data": ["48 /zentaopms/www/index.php", 10, 0, 0.0, 1018.1, 932, 1103, 1098.5, 1103.0, 1103.0, 5.083884087442806, 48.21944903406202, 5.8534173233350275], "isController": false}, {"data": ["10 /zentaopms/www/index.php", 10, 0, 0.0, 367.09999999999997, 244, 409, 408.0, 409.0, 409.0, 8.319467554076539, 6.14210690515807, 5.159044821131448], "isController": false}, {"data": ["22 /zentaopms/www/index.php", 10, 0, 0.0, 395.3, 383, 411, 410.0, 411.0, 411.0, 7.278020378457059, 5.572234352256186, 3.96595251091703], "isController": false}, {"data": ["19 /zentaopms/www/index.php", 10, 0, 0.0, 399.1000000000001, 387, 414, 413.2, 414.0, 414.0, 7.320644216691069, 5.633464494875549, 3.9963282393850657], "isController": false}, {"data": ["7 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html", 10, 10, 100.0, 21018.0, 20997, 21041, 21040.7, 21041.0, 21041.0, 0.4668752042579019, 0.9725046979317429, 0.0], "isController": false}, {"data": ["28 /zentaopms/www/js/chartjs/chart.line.min.js", 10, 0, 0.0, 4.7, 4, 5, 5.0, 5.0, 5.0, 9.980039920159681, 84.64516279940119, 6.286255613772455], "isController": false}, {"data": ["24 /zentaopms/www/index.php", 10, 0, 0.0, 397.49999999999994, 383, 410, 409.7, 410.0, 410.0, 7.132667617689016, 5.460948644793153, 3.8867466119828817], "isController": false}, {"data": ["25 /zentaopms/www/index.php", 10, 0, 0.0, 391.1, 377, 405, 404.7, 405.0, 405.0, 7.147962830593281, 5.472659042172981, 3.8950813080771978], "isController": false}, {"data": ["39 /zentaopms/www/js/kindeditor/kindeditor-min.js", 10, 0, 0.0, 17.400000000000002, 12, 23, 22.9, 23.0, 23.0, 9.532888465204957, 882.3228223307913, 4.952633460438514], "isController": false}, {"data": ["50 /zentaopms/www/index.php", 10, 0, 0.0, 374.5, 197, 538, 535.0, 538.0, 538.0, 9.041591320072333, 79.30111324593128, 5.200680944846292], "isController": false}, {"data": ["6 /zentaopms/www/js/md5.js", 10, 0, 0.0, 5.8, 4, 8, 8.0, 8.0, 8.0, 24.154589371980677, 146.64949426328502, 12.737771739130435], "isController": false}, {"data": ["26 /zentaopms/www/index.php", 10, 0, 0.0, 396.8, 385, 419, 418.1, 419.0, 419.0, 7.173601147776184, 5.492288378766141, 3.90905218794835], "isController": false}, {"data": ["42 /zentaopms/www/theme/zui/css/min.css", 10, 0, 0.0, 20.7, 15, 28, 27.8, 28.0, 28.0, 9.532888465204957, 1152.1203229265968, 4.9991807673975215], "isController": false}, {"data": ["46 /zentaopms/www/index.php?m=bug&f=create&productID=12&branch=0&extra=moduleID=0", 10, 0, 0.0, 396.79999999999995, 386, 407, 406.7, 407.0, 407.0, 6.882312456985547, 5.430574673090158, 21.887635495526496], "isController": false}, {"data": ["31 /zentaopms/www/index.php", 10, 0, 0.0, 391.59999999999997, 376, 412, 411.3, 412.0, 412.0, 7.168458781362007, 5.516353046594982, 3.913250448028674], "isController": false}, {"data": ["14 /zentaopms/www/theme/default/fonts/zenicon.woff", 10, 0, 0.0, 6.4, 5, 10, 9.8, 10.0, 10.0, 10.395010395010395, 199.8806198024948, 5.83704196985447], "isController": false}, {"data": ["41 /zentaopms/www/js/kindeditor/themes/default/default.png", 10, 0, 0.0, 5.3, 3, 8, 7.9, 8.0, 8.0, 9.643201542912246, 67.91676711668275, 4.8781039054966255], "isController": false}, {"data": ["1 /success.txt", 10, 10, 100.0, 42096.00000000001, 42001, 42329, 42316.5, 42329.0, 42329.0, 0.23313827431049355, 0.4856288467815261, 0.0], "isController": false}, {"data": ["36 /zentaopms/www/js/jquery/form/min.js", 10, 0, 0.0, 5.800000000000001, 4, 8, 7.9, 8.0, 8.0, 9.718172983479105, 140.15427599611274, 5.029913751214772], "isController": false}, {"data": ["45 /zentaopms/www/index.php", 10, 0, 0.0, 400.5, 385, 421, 420.4, 421.0, 421.0, 6.802721088435374, 5.553784013605442, 4.105548469387755], "isController": false}, {"data": ["33 /zentaopms/www/index.php", 10, 0, 0.0, 392.2, 374, 412, 411.2, 412.0, 412.0, 7.052186177715092, 5.426877644569817, 3.849777415373766], "isController": false}, {"data": ["21 /zentaopms/www/index.php", 10, 0, 0.0, 394.8, 381, 405, 404.9, 405.0, 405.0, 7.24112961622013, 5.543989862418537, 3.945849927588704], "isController": false}, {"data": ["47 /zentaopms/www/index.php", 10, 0, 0.0, 390.20000000000005, 378, 406, 405.9, 406.0, 406.0, 6.97350069735007, 5.2846059972106, 4.276717224546722], "isController": false}, {"data": ["18 /zentaopms/www/index.php", 10, 0, 0.0, 396.3, 387, 408, 407.5, 408.0, 408.0, 7.407407407407407, 5.671296296296296, 4.036458333333333], "isController": false}, {"data": ["2 /zentaopms/www/index.php", 10, 0, 0.0, 236.0, 53, 364, 363.3, 364.0, 364.0, 10.183299389002038, 8.094927443991853, 4.067352978615071], "isController": false}, {"data": ["8 /zentaopms/www/favicon.ico", 10, 0, 0.0, 5.0, 4, 6, 6.0, 6.0, 6.0, 26.10966057441253, 252.2743962140992, 10.122593015665796], "isController": false}, {"data": ["23 /zentaopms/www/index.php", 10, 0, 0.0, 394.5, 381, 428, 425.5, 428.0, 428.0, 7.1890726096333575, 5.504133716750539, 3.917482925952552], "isController": false}, {"data": ["35 /zentaopms/www/index.php", 10, 0, 0.0, 391.3, 370, 422, 420.5, 422.0, 422.0, 7.1377587437544605, 5.660019628836546, 4.391394539614561], "isController": false}, {"data": ["4 /favicon.ico", 10, 10, 100.0, 3.9999999999999996, 3, 6, 5.9, 6.0, 6.0, 13.850415512465373, 6.370650103878116, 5.410318559556787], "isController": false}, {"data": ["16 /zentaopms/www/theme/default/images/main/icon.png", 10, 0, 0.0, 4.5, 3, 6, 6.0, 6.0, 6.0, 10.427528675703858, 37.901622784150156, 5.203581204379562], "isController": false}, {"data": ["38 /zentaopms/www/js/kindeditor/themes/default/default.css", 10, 0, 0.0, 7.2, 4, 10, 10.0, 10.0, 10.0, 9.68054211035818, 170.34539871732818, 5.256231848983544], "isController": false}, {"data": ["5 /zentaopms/www/theme/default/zh-cn.default.css", 10, 0, 0.0, 35.70000000000001, 21, 57, 56.8, 57.0, 57.0, 23.25581395348837, 4205.8730014534885, 13.104106104651162], "isController": false}, {"data": ["49 /success.txt", 10, 10, 100.0, 42074.700000000004, 42017, 42188, 42186.5, 42188.0, 42188.0, 0.23426335886803945, 0.48797240670461733, 0.0], "isController": false}, {"data": ["9 /zentaopms/www/index.php?m=user&f=login&referer=L3plbnRhb3Btcy93d3cvaW5kZXgucGhwP209bXkmZj1pbmRleA==", 10, 0, 0.0, 381.9, 143, 569, 563.4, 569.0, 569.0, 10.570824524312897, 8.622861059725158, 9.125594608879494], "isController": false}, {"data": ["43 /zentaopms/www/index.php", 10, 0, 0.0, 402.8, 370, 432, 431.8, 432.0, 432.0, 6.963788300835654, 5.549268802228412, 4.093945856545961], "isController": false}, {"data": ["27 /zentaopms/www/theme/default/images/main/green.png", 10, 0, 0.0, 4.0, 3, 5, 5.0, 5.0, 5.0, 9.99000999000999, 29.160292832167837, 4.82915521978022], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 40, 66.66666666666667, 7.8431372549019605], "isController": false}, {"data": ["404/Not Found", 10, 16.666666666666668, 1.9607843137254901], "isController": false}, {"data": ["Response was null", 10, 16.666666666666668, 1.9607843137254901], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 510, 60, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 40, "404/Not Found", 10, "Response was null", 10, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["11 /zentaopms/www/theme/default/index.css", 10, 10, "Response was null", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["7 /updater-isLatest-9.8.1-99a1c6256b6c32207872120340a063ce.html", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["1 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4 /favicon.ico", 10, 10, "404/Not Found", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["49 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
