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

    var data = {"OkPercent": 94.38888888888889, "KoPercent": 5.611111111111111};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9138888888888889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "4308 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4285 /service//clerk/receive/getItemDetail.json"], "isController": false}, {"data": [1.0, 500, 1500, "4288 /service//clerk/receive/getItemList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4329 /service//clerk/receive/getQuoteList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4265 /service//clerk/common/getBxInsurerinfoList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4262 /service//clerk/common/saveUserAction.json"], "isController": false}, {"data": [1.0, 500, 1500, "4277 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4274 /service//clerk/receive/getcategory/0.json"], "isController": false}, {"data": [1.0, 500, 1500, "4267 /service//clerk/receive/senderItem.json"], "isController": false}, {"data": [1.0, 500, 1500, "4316 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4311 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4273 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4283 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4293 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4325 /service//clerk/common/saveUserAction.json"], "isController": false}, {"data": [1.0, 500, 1500, "4271 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4291 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4304 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4303 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4268 /service//clerk/common/getCarmodelbyvin.json"], "isController": false}, {"data": [1.0, 500, 1500, "4289 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4314 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4313 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4270 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4264 /service//clerk/receive/getCarnoByMaintain.json"], "isController": false}, {"data": [1.0, 500, 1500, "4306 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4319 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4286 /service//clerk/receive/getcategory/1.json"], "isController": false}, {"data": [0.0, 500, 1500, "4333 /Public/data/files/qr/42c1c06d6929a747ef3934f45c1d26ea.png"], "isController": false}, {"data": [1.0, 500, 1500, "4269 /service//clerk/receive/saveOrUpdateClientDetail.json"], "isController": false}, {"data": [1.0, 500, 1500, "4263 /service//clerk/receive/getClientDetail.json"], "isController": false}, {"data": [1.0, 500, 1500, "4317 /service//clerk/receive/getItemList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4309 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [0.38, 500, 1500, "4299 /service//clerk/receive/getItemList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4307 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [0.0, 500, 1500, "4332 /index.php/Test/qrcodes"], "isController": false}, {"data": [1.0, 500, 1500, "4282 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4292 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4300 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4315 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4305 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4320 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4324 /service//clerk/receive/getReceiveOrderDetail.json"], "isController": false}, {"data": [1.0, 500, 1500, "4266 /service//clerk/common/getCarmodelbyvin.json"], "isController": false}, {"data": [1.0, 500, 1500, "4310 /service//clerk/receive/getcategory/4.json"], "isController": false}, {"data": [0.98, 500, 1500, "4318 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4302 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4275 /service//clerk/receive/getItemList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4280 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4290 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4322 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4297 /service//clerk/receive/getcategory/2.json"], "isController": false}, {"data": [0.96, 500, 1500, "4321 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [0.94, 500, 1500, "4326 /service//clerk/receive/saveReceiveOrder.json?access_token=0513b9cd-4df8-3a17-9e55-124d0a334df1&platform=9&phoneType=android"], "isController": false}, {"data": [0.0, 500, 1500, "4330 /index.php/Test/qrcodes"], "isController": false}, {"data": [1.0, 500, 1500, "4295 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [0.64, 500, 1500, "4312 /service//clerk/receive/getItemList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4276 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [0.46, 500, 1500, "4301 /service//clerk/receive/getItemList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4284 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4294 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4287 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [0.0, 500, 1500, "4331 /Public/data/files/qr/42c1c06d6929a747ef3934f45c1d26ea.png"], "isController": false}, {"data": [1.0, 500, 1500, "4327 /service//clerk/receive/progress/buried.json?access_token=0513b9cd-4df8-3a17-9e55-124d0a334df1&platform=9&phoneType=android"], "isController": false}, {"data": [1.0, 500, 1500, "4296 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4328 /service//clerk/receive/getReceiveOrderDetail.json"], "isController": false}, {"data": [1.0, 500, 1500, "4281 /service//clerk/receive/saveOrDeleteQuote.json"], "isController": false}, {"data": [1.0, 500, 1500, "4278 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [0.44, 500, 1500, "4272 /service//clerk/receive/queryProd.json"], "isController": false}, {"data": [1.0, 500, 1500, "4323 /service//clerk/receive/getQuoteList.json"], "isController": false}, {"data": [1.0, 500, 1500, "4298 /service//clerk/receive/getQuoteNum.json"], "isController": false}, {"data": [1.0, 500, 1500, "4279 /service//clerk/receive/getQuoteNum.json"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 101, 5.611111111111111, 200.2155555555551, 20, 3606, 788.4000000000024, 1136.0, 1472.8200000000002, 24.0, 74.96552083333333, 7.725911458333333], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["4308 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 54.32000000000001, 22, 142, 112.4, 134.2, 142.0, 0.4182910301671491, 0.4632246369233858, 0.10620670687837769], "isController": false}, {"data": ["4285 /service//clerk/receive/getItemDetail.json", 25, 0, 0.0, 78.04, 28, 270, 121.00000000000003, 227.0999999999999, 270.0, 0.4109611559515394, 0.37885481564282547, 0.11156953257278122], "isController": false}, {"data": ["4288 /service//clerk/receive/getItemList.json", 25, 0, 0.0, 77.28, 49, 132, 114.20000000000006, 131.7, 132.0, 0.4123099251245176, 3.1458764111307187, 0.14012095111653528], "isController": false}, {"data": ["4329 /service//clerk/receive/getQuoteList.json", 25, 0, 0.0, 183.12, 125, 428, 287.40000000000003, 386.8999999999999, 428.0, 0.42964185055337867, 4.794970881023579, 0.10950832323674985], "isController": false}, {"data": ["4265 /service//clerk/common/getBxInsurerinfoList.json", 25, 0, 0.0, 70.32, 24, 291, 98.00000000000003, 234.89999999999986, 291.0, 0.4114278191034165, 1.8115359731913632, 0.09602661012277006], "isController": false}, {"data": ["4262 /service//clerk/common/saveUserAction.json", 25, 0, 0.0, 72.96000000000001, 25, 346, 206.80000000000004, 307.2999999999999, 346.0, 0.40931938372873583, 0.24023530236422877, 0.12831203337590255], "isController": false}, {"data": ["4277 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 111.35999999999999, 46, 302, 181.80000000000007, 271.69999999999993, 302.0, 0.41242555718692775, 0.2561549359090684, 0.23843352524869263], "isController": false}, {"data": ["4274 /service//clerk/receive/getcategory/0.json", 25, 0, 0.0, 75.64, 31, 135, 116.60000000000002, 131.1, 135.0, 0.4137497310626748, 1.1111442972874568, 0.11394279703093192], "isController": false}, {"data": ["4267 /service//clerk/receive/senderItem.json", 25, 0, 0.0, 59.32, 21, 258, 85.4, 206.39999999999986, 258.0, 0.4119023297195769, 0.4662058595165914, 0.10498682427422809], "isController": false}, {"data": ["4316 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 53.28, 22, 92, 88.80000000000001, 91.4, 92.0, 0.42122999157540014, 0.46647930707666385, 0.10695292754844145], "isController": false}, {"data": ["4311 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 58.6, 23, 100, 87.4, 97.3, 100.0, 0.41876748354243787, 0.46375227181359824, 0.10632768136819712], "isController": false}, {"data": ["4273 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 58.6, 22, 107, 83.4, 100.09999999999998, 107.0, 0.4137771230904186, 0.45822583748489715, 0.1050605976596766], "isController": false}, {"data": ["4283 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 62.80000000000002, 27, 115, 102.80000000000001, 111.69999999999999, 115.0, 0.4120652711389484, 0.4563300951870776, 0.10462594775012361], "isController": false}, {"data": ["4293 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 104.08, 44, 186, 142.60000000000002, 174.59999999999997, 186.0, 0.4132436319156322, 0.2566630370100997, 0.2606986193530258], "isController": false}, {"data": ["4325 /service//clerk/common/saveUserAction.json", 25, 0, 0.0, 52.51999999999999, 22, 323, 83.60000000000002, 252.79999999999984, 323.0, 0.4262283902206158, 0.2501594360572169, 0.13361261060626725], "isController": false}, {"data": ["4271 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 55.84, 23, 101, 87.40000000000002, 98.89999999999999, 101.0, 0.4137291894217721, 0.458172754691689, 0.10504842700162181], "isController": false}, {"data": ["4291 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 58.88000000000002, 25, 106, 98.00000000000001, 104.5, 106.0, 0.4131889926452359, 0.45757452896454837, 0.10491126766382942], "isController": false}, {"data": ["4304 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 60.95999999999999, 28, 109, 108.4, 109.0, 109.0, 0.4188236082491498, 0.4638144255415389, 0.10634193178201068], "isController": false}, {"data": ["4303 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 56.400000000000006, 29, 121, 84.2, 110.49999999999997, 121.0, 0.41881659183810227, 0.4638066554144609, 0.10634015027139315], "isController": false}, {"data": ["4268 /service//clerk/common/getCarmodelbyvin.json", 25, 0, 0.0, 62.4, 30, 112, 109.0, 111.1, 112.0, 0.4133187845121185, 0.3338033542885957, 0.10373332775352975], "isController": false}, {"data": ["4289 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 86.44, 24, 170, 122.80000000000001, 156.19999999999996, 170.0, 0.41241195004866466, 0.2518451568402646, 0.2420503730266088], "isController": false}, {"data": ["4314 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 56.95999999999999, 20, 111, 93.2, 106.19999999999999, 111.0, 0.42171316757194427, 0.46701438674471174, 0.10707560895381397], "isController": false}, {"data": ["4313 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 118.88, 52, 353, 237.40000000000003, 321.19999999999993, 353.0, 0.420019824935737, 0.2608716881436804, 0.25759028326136996], "isController": false}, {"data": ["4270 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 221.64000000000001, 112, 424, 332.6, 400.9, 424.0, 0.4129705799758825, 1.3941789990006113, 0.2173741627021491], "isController": false}, {"data": ["4264 /service//clerk/receive/getCarnoByMaintain.json", 25, 0, 0.0, 74.12, 25, 364, 169.6000000000003, 331.5999999999999, 364.0, 0.40927247724445026, 0.8241404766387269, 0.1183053254534739], "isController": false}, {"data": ["4306 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 140.16000000000003, 39, 496, 378.40000000000043, 495.1, 496.0, 0.41835402791258075, 0.25983707202382944, 0.2745448308176311], "isController": false}, {"data": ["4319 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 59.64000000000001, 22, 190, 88.20000000000002, 160.89999999999992, 190.0, 0.4231908590774439, 0.4686508146424037, 0.10745080406263224], "isController": false}, {"data": ["4286 /service//clerk/receive/getcategory/1.json", 25, 0, 0.0, 75.48, 33, 116, 106.4, 113.3, 116.0, 0.41172595520421607, 8.957854058588604, 0.11338546813241107], "isController": false}, {"data": ["4333 /Public/data/files/qr/42c1c06d6929a747ef3934f45c1d26ea.png", 25, 25, 100.0, 1138.6400000000003, 1106, 1166, 1159.4, 1164.2, 1166.0, 0.41619497902377306, 0.8661245120113871, 0.0], "isController": false}, {"data": ["4269 /service//clerk/receive/saveOrUpdateClientDetail.json", 25, 0, 0.0, 84.48000000000002, 44, 226, 148.20000000000002, 203.19999999999993, 226.0, 0.4131889926452359, 0.2598571399057929, 0.26954125692091563], "isController": false}, {"data": ["4263 /service//clerk/receive/getClientDetail.json", 25, 0, 0.0, 92.87999999999998, 47, 300, 151.20000000000002, 257.69999999999993, 300.0, 0.40942663893483566, 1.1731032799168044, 0.14074040713384975], "isController": false}, {"data": ["4317 /service//clerk/receive/getItemList.json", 25, 0, 0.0, 266.15999999999997, 178, 494, 359.0, 455.2999999999999, 494.0, 0.42084708100464613, 5.071125129410477, 0.14096733279745471], "isController": false}, {"data": ["4309 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 52.400000000000006, 22, 135, 78.00000000000001, 118.79999999999995, 135.0, 0.4185431350554988, 0.4635038233915387, 0.10627071788518525], "isController": false}, {"data": ["4299 /service//clerk/receive/getItemList.json", 25, 0, 0.0, 1290.92, 817, 1909, 1740.8000000000002, 1878.6999999999998, 1909.0, 0.40425600724426763, 0.2467382856715501, 0.13738387746191907], "isController": false}, {"data": ["4307 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 54.31999999999999, 25, 107, 86.80000000000003, 103.1, 107.0, 0.4181580972133944, 0.46307742406248953, 0.10617295437058843], "isController": false}, {"data": ["4332 /index.php/Test/qrcodes", 25, 25, 100.0, 1241.0399999999997, 1104, 3606, 1217.0000000000002, 2907.2999999999984, 3606.0, 0.4164584374479427, 0.8666727833999667, 0.0], "isController": false}, {"data": ["4282 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 63.60000000000001, 34, 126, 88.4, 114.89999999999998, 126.0, 0.41208564788105556, 0.45635266083702836, 0.10463112153229927], "isController": false}, {"data": ["4292 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 55.199999999999996, 23, 89, 83.80000000000001, 88.7, 89.0, 0.41291601288297963, 0.4572722252043934, 0.10484195639606904], "isController": false}, {"data": ["4300 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 47.32, 28, 107, 77.60000000000001, 98.89999999999998, 107.0, 0.412173970389422, 0.45645047111484816, 0.10465354716918916], "isController": false}, {"data": ["4315 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 60.56, 23, 119, 107.00000000000003, 117.19999999999999, 119.0, 0.42071251872170706, 0.4659062463187654, 0.10682153795668343], "isController": false}, {"data": ["4305 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 62.080000000000005, 23, 149, 90.4, 132.49999999999994, 149.0, 0.4186693014921374, 0.46364354286336307, 0.106302752331988], "isController": false}, {"data": ["4320 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 60.24, 22, 117, 95.20000000000007, 116.4, 117.0, 0.42361393520401247, 0.469119338399756, 0.1075582257353938], "isController": false}, {"data": ["4324 /service//clerk/receive/getReceiveOrderDetail.json", 25, 0, 0.0, 110.52000000000001, 60, 265, 190.40000000000003, 244.59999999999997, 265.0, 0.42501827578585877, 0.9496502099590283, 0.1257622437139797], "isController": false}, {"data": ["4266 /service//clerk/common/getCarmodelbyvin.json", 25, 0, 0.0, 63.76000000000001, 31, 117, 98.20000000000002, 112.79999999999998, 117.0, 0.41152940789148795, 0.3323582229748638, 0.10328423616026601], "isController": false}, {"data": ["4310 /service//clerk/receive/getcategory/4.json", 25, 0, 0.0, 68.39999999999999, 31, 128, 103.80000000000001, 121.09999999999998, 128.0, 0.41841004184100417, 2.5692991631799162, 0.11522620292887029], "isController": false}, {"data": ["4318 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 126.19999999999999, 45, 662, 267.2, 544.0999999999997, 662.0, 0.4225471140032113, 0.26244137158793207, 0.250474705273388], "isController": false}, {"data": ["4302 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 95.24, 47, 214, 138.00000000000009, 199.29999999999995, 214.0, 0.41772490308782245, 0.25944632652720223, 0.27413196765138353], "isController": false}, {"data": ["4275 /service//clerk/receive/getItemList.json", 25, 0, 0.0, 81.63999999999999, 44, 139, 114.40000000000002, 133.6, 139.0, 0.41285464213759615, 2.17393772500578, 0.1403060697889487], "isController": false}, {"data": ["4280 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 61.16, 34, 98, 82.4, 93.49999999999999, 98.0, 0.4123915410247105, 0.45669141359572435, 0.1047087897133054], "isController": false}, {"data": ["4290 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 62.28, 24, 125, 105.20000000000003, 121.39999999999999, 125.0, 0.4130319851969336, 0.4574006554817605, 0.10487140249140894], "isController": false}, {"data": ["4322 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 50.32, 22, 201, 78.00000000000003, 165.89999999999992, 201.0, 0.42492436346330353, 0.47057053531971305, 0.1078909516606044], "isController": false}, {"data": ["4297 /service//clerk/receive/getcategory/2.json", 25, 0, 0.0, 89.75999999999999, 45, 246, 119.2, 208.49999999999991, 246.0, 0.413352953820208, 24.69180016244771, 0.11383352829814322], "isController": false}, {"data": ["4321 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 283.2, 131, 1146, 491.00000000000045, 985.4999999999995, 1146.0, 0.42318369557857677, 1.4121276247968717, 0.19299490804218294], "isController": false}, {"data": ["4326 /service//clerk/receive/saveReceiveOrder.json?access_token=0513b9cd-4df8-3a17-9e55-124d0a334df1&platform=9&phoneType=android", 25, 1, 4.0, 186.16000000000003, 75, 765, 299.0000000000001, 633.2999999999997, 765.0, 0.4279429637617898, 0.2575347382700834, 0.5257346175901676], "isController": false}, {"data": ["4330 /index.php/Test/qrcodes", 25, 25, 100.0, 1225.32, 1091, 3604, 1167.6, 2873.7999999999984, 3604.0, 0.4227257355427798, 0.8797153734781873, 0.0], "isController": false}, {"data": ["4295 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 60.519999999999996, 26, 120, 117.00000000000001, 120.0, 120.0, 0.41333245155743664, 0.45773339850208317, 0.1049476927782554], "isController": false}, {"data": ["4312 /service//clerk/receive/getItemList.json", 25, 0, 0.0, 613.56, 360, 1093, 851.8000000000001, 1022.7999999999998, 1093.0, 0.4165555851772861, 0.38645293546720877, 0.14075022702279394], "isController": false}, {"data": ["4276 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 67.8, 23, 128, 115.00000000000001, 125.0, 128.0, 0.41353756575247297, 0.4579605464485394, 0.10499977255433883], "isController": false}, {"data": ["4301 /service//clerk/receive/getItemList.json", 25, 0, 0.0, 1100.7199999999998, 760, 1754, 1519.0000000000002, 1701.4999999999998, 1754.0, 0.4074647542987531, 3.0256486329557495, 0.13927017969195665], "isController": false}, {"data": ["4284 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 67.28, 32, 117, 109.2, 115.19999999999999, 117.0, 0.412173970389422, 0.45645047111484816, 0.10465354716918916], "isController": false}, {"data": ["4294 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 57.839999999999996, 27, 118, 98.40000000000006, 116.8, 118.0, 0.4132436319156322, 0.4576350376878192, 0.10492514091607848], "isController": false}, {"data": ["4287 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 65.8, 21, 118, 97.40000000000002, 113.79999999999998, 118.0, 0.41218076599673553, 0.45645799671904114, 0.10465527261635864], "isController": false}, {"data": ["4331 /Public/data/files/qr/42c1c06d6929a747ef3934f45c1d26ea.png", 25, 25, 100.0, 1136.8799999999999, 1089, 1180, 1171.8, 1177.9, 1180.0, 0.4227900762713298, 0.8798492700529333, 0.0], "isController": false}, {"data": ["4327 /service//clerk/receive/progress/buried.json?access_token=0513b9cd-4df8-3a17-9e55-124d0a334df1&platform=9&phoneType=android", 25, 0, 0.0, 53.720000000000006, 28, 182, 90.80000000000001, 154.99999999999994, 182.0, 0.42925087137926893, 0.2619939400508233, 0.20749920052025206], "isController": false}, {"data": ["4296 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 62.63999999999999, 24, 100, 93.4, 99.1, 100.0, 0.41357177124518185, 0.4579984263594104, 0.10500845754272196], "isController": false}, {"data": ["4328 /service//clerk/receive/getReceiveOrderDetail.json", 25, 0, 0.0, 95.72, 56, 207, 150.40000000000012, 201.0, 207.0, 0.4290519667742157, 0.9586629882611382, 0.12695580657479233], "isController": false}, {"data": ["4281 /service//clerk/receive/saveOrDeleteQuote.json", 25, 0, 0.0, 109.95999999999998, 58, 198, 169.4000000000001, 195.9, 198.0, 0.41209244057627004, 0.25594803926416776, 0.2454847546401609], "isController": false}, {"data": ["4278 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 59.000000000000014, 28, 103, 80.20000000000002, 97.6, 103.0, 0.4124459695779853, 0.45675168896624546, 0.10472260946316034], "isController": false}, {"data": ["4272 /service//clerk/receive/queryProd.json", 25, 0, 0.0, 1148.9599999999998, 791, 1747, 1607.8000000000004, 1730.8, 1747.0, 0.4029398491393205, 1.4429496355409066, 0.11726179203468506], "isController": false}, {"data": ["4323 /service//clerk/receive/getQuoteList.json", 25, 0, 0.0, 219.36, 133, 449, 312.2, 408.4999999999999, 449.0, 0.4249099190971514, 4.745281109779727, 0.10830223523862942], "isController": false}, {"data": ["4298 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 66.6, 24, 146, 107.40000000000003, 137.29999999999998, 146.0, 0.413715496127623, 0.4581575904382075, 0.10504495018865427], "isController": false}, {"data": ["4279 /service//clerk/receive/getQuoteNum.json", 25, 0, 0.0, 55.32, 28, 78, 73.4, 77.7, 78.0, 0.41243916522312957, 0.45674415367483295, 0.10472088179493524], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 1, 0.9900990099009901, 0.05555555555555555], "isController": false}, {"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 100, 99.00990099009901, 5.555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 101, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 100, "400", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4333 /Public/data/files/qr/42c1c06d6929a747ef3934f45c1d26ea.png", 25, 25, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4332 /index.php/Test/qrcodes", 25, 25, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4326 /service//clerk/receive/saveReceiveOrder.json?access_token=0513b9cd-4df8-3a17-9e55-124d0a334df1&platform=9&phoneType=android", 25, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["4330 /index.php/Test/qrcodes", 25, 25, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4331 /Public/data/files/qr/42c1c06d6929a747ef3934f45c1d26ea.png", 25, 25, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
