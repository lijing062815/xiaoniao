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

    var data = {"OkPercent": 99.16666666666667, "KoPercent": 0.8333333333333334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6181481481481481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.78, 500, 1500, "28 新增/修改/删除报价项目"], "isController": false}, {"data": [0.48, 500, 1500, "43 新增/修改/删除报价项目"], "isController": false}, {"data": [0.475, 500, 1500, "45 新增/修改/删除报价项目"], "isController": false}, {"data": [0.025, 500, 1500, "09 新增/修改/删除报价项目"], "isController": false}, {"data": [0.89, 500, 1500, "11 查询项目分类-套餐"], "isController": false}, {"data": [0.565, 500, 1500, "02 根据车牌获取工单状态"], "isController": false}, {"data": [0.995, 500, 1500, "22 已选报价项目数"], "isController": false}, {"data": [0.46, 500, 1500, "01 客户档案资料"], "isController": false}, {"data": [0.98, 500, 1500, "31 已选报价项目数"], "isController": false}, {"data": [0.94, 500, 1500, "07 新增/编辑客户档案"], "isController": false}, {"data": [0.005, 500, 1500, "32 查询项目列表"], "isController": false}, {"data": [0.0, 500, 1500, "48 已选报价项目列表接口"], "isController": false}, {"data": [0.41, 500, 1500, "46 接车单详情"], "isController": false}, {"data": [1.0, 500, 1500, "06 保险公司字典接口"], "isController": false}, {"data": [0.52, 500, 1500, "41 新增/修改/删除报价项目"], "isController": false}, {"data": [0.475, 500, 1500, "33 新增/修改/删除报价项目"], "isController": false}, {"data": [0.995, 500, 1500, "42 已选报价项目数"], "isController": false}, {"data": [0.965, 500, 1500, "40 已选报价项目数"], "isController": false}, {"data": [0.45, 500, 1500, "52 接车单详情"], "isController": false}, {"data": [0.99, 500, 1500, "29 已选报价项目数"], "isController": false}, {"data": [0.59, 500, 1500, "15 查询项目列表"], "isController": false}, {"data": [0.99, 500, 1500, "44 已选报价项目数"], "isController": false}, {"data": [0.48, 500, 1500, "39 新增/修改/删除报价项目"], "isController": false}, {"data": [0.98, 500, 1500, "04 根据车架号获取车型"], "isController": false}, {"data": [0.0, 500, 1500, "53 已选报价项目列表接口"], "isController": false}, {"data": [0.99, 500, 1500, "14 查询项目列表明细"], "isController": false}, {"data": [0.03, 500, 1500, "49 新增/修改/删除报价项目"], "isController": false}, {"data": [0.22, 500, 1500, "50 添加或修改接车单"], "isController": false}, {"data": [1.0, 500, 1500, "08 判断新客户0元推荐"], "isController": false}, {"data": [0.9, 500, 1500, "51 前端埋点接口"], "isController": false}, {"data": [0.97, 500, 1500, "05 客户来源字典接口"], "isController": false}, {"data": [0.97, 500, 1500, "34 已选报价项目数"], "isController": false}, {"data": [0.0, 500, 1500, "13 查询项目搜索"], "isController": false}, {"data": [0.97, 500, 1500, "19 已选报价项目数"], "isController": false}, {"data": [0.65, 500, 1500, "20 查询项目列表"], "isController": false}, {"data": [1.0, 500, 1500, "17 已选报价项目数"], "isController": false}, {"data": [0.305, 500, 1500, "37 保存活动转订单"], "isController": false}, {"data": [0.985, 500, 1500, "15 已选报价项目数"], "isController": false}, {"data": [0.0, 500, 1500, "03 获取送修人信息"], "isController": false}, {"data": [0.49, 500, 1500, "21 新增/修改/删除报价项目"], "isController": false}, {"data": [0.02, 500, 1500, "38 查询项目列表"], "isController": false}, {"data": [0.99, 500, 1500, "47 已选报价项目数"], "isController": false}, {"data": [0.02, 500, 1500, "25 查询项目列表"], "isController": false}, {"data": [0.02, 500, 1500, "35 查询项目列表"], "isController": false}, {"data": [0.78, 500, 1500, "30 查询项目分类-喷漆"], "isController": false}, {"data": [0.06, 500, 1500, "27 查询项目列表"], "isController": false}, {"data": [0.99, 500, 1500, "12 已选报价项目数"], "isController": false}, {"data": [0.39, 500, 1500, "36 线下活动列表"], "isController": false}, {"data": [0.905, 500, 1500, "23 查询项目分类-配件"], "isController": false}, {"data": [0.995, 500, 1500, "26 已选报价项目数"], "isController": false}, {"data": [0.805, 500, 1500, "18 查询项目分类-工时"], "isController": false}, {"data": [0.505, 500, 1500, "16 新增/修改/删除报价项目"], "isController": false}, {"data": [0.99, 500, 1500, "24 已选报价项目数"], "isController": false}, {"data": [0.99, 500, 1500, "10 已选报价项目数"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5400, 45, 0.8333333333333334, 1717.28203703704, 22, 52270, 4265.000000000011, 7565.749999999992, 15434.54999999999, 29.251328497835942, 411.8868954132969, 10.600538407265164], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["28 新增/修改/删除报价项目", 100, 0, 0.0, 528.0400000000001, 54, 1562, 992.0, 1243.9999999999998, 1560.7199999999993, 0.6064796283492838, 0.376680706670063, 0.4080707655592349], "isController": false}, {"data": ["43 新增/修改/删除报价项目", 100, 0, 0.0, 1019.6699999999993, 277, 1854, 1403.8000000000002, 1607.4499999999994, 1852.6699999999994, 4.37368789363191, 2.7164702151854443, 2.490097697253324], "isController": false}, {"data": ["45 新增/修改/删除报价项目", 100, 0, 0.0, 1016.8400000000004, 491, 2446, 1287.4, 1532.8499999999997, 2445.3199999999997, 4.242861385718529, 2.6352146887861174, 2.415613464720608], "isController": false}, {"data": ["09 新增/修改/删除报价项目", 100, 27, 27.0, 2907.34, 759, 7316, 4792.000000000003, 5022.849999999999, 7303.209999999994, 0.5957664833691786, 1.5544268987077825, 0.31126471543213924], "isController": false}, {"data": ["11 查询项目分类-套餐", 100, 0, 0.0, 386.26000000000016, 74, 1135, 655.9, 834.2999999999998, 1134.6499999999999, 0.6047631142881333, 1.6241196916917642, 0.16654609202075546], "isController": false}, {"data": ["02 根据车牌获取工单状态", 100, 0, 0.0, 972.5500000000005, 99, 3086, 2263.2, 2487.199999999999, 3084.3399999999992, 0.6362658827870991, 1.2830947733939058, 0.18392060674314584], "isController": false}, {"data": ["22 已选报价项目数", 100, 0, 0.0, 202.45999999999992, 99, 583, 258.8, 384.7999999999997, 582.1399999999995, 3.892262182780632, 4.314177321734392, 0.9882696948466448], "isController": false}, {"data": ["01 客户档案资料", 100, 0, 0.0, 1223.7099999999998, 107, 7365, 2073.2, 2524.499999999999, 7349.709999999992, 0.636168737395907, 1.827742602948006, 0.21868300347984299], "isController": false}, {"data": ["31 已选报价项目数", 100, 0, 0.0, 205.68999999999997, 54, 1136, 300.6, 427.5999999999999, 1133.4299999999987, 0.8985533291400845, 0.9959551060292928, 0.22814830622697455], "isController": false}, {"data": ["07 新增/编辑客户档案", 100, 0, 0.0, 344.40999999999997, 74, 3163, 500.9000000000002, 578.95, 3147.469999999992, 0.5983509447961418, 0.41195060164187497, 0.3728006863085337], "isController": false}, {"data": ["32 查询项目列表", 100, 0, 0.0, 6981.3, 1451, 31545, 12399.5, 15940.849999999986, 31509.24999999998, 0.8551978927923921, 0.793396482571067, 0.2889633504943044], "isController": false}, {"data": ["48 已选报价项目列表接口", 100, 0, 0.0, 3524.51, 1503, 10570, 4773.000000000001, 7577.449999999972, 10543.719999999987, 0.6881838827334664, 11.976281312366664, 0.1754062435482761], "isController": false}, {"data": ["46 接车单详情", 100, 0, 0.0, 1324.8199999999997, 146, 6090, 2521.9, 2836.2999999999993, 6077.929999999994, 0.6970001115200178, 1.5594016166917586, 0.20624124393609902], "isController": false}, {"data": ["06 保险公司字典接口", 100, 0, 0.0, 149.07999999999998, 50, 293, 231.10000000000005, 261.74999999999994, 292.7899999999999, 0.6551062254744606, 2.8840155923470494, 0.15290076942226183], "isController": false}, {"data": ["41 新增/修改/删除报价项目", 100, 0, 0.0, 946.9599999999998, 182, 1719, 1339.4, 1395.0499999999997, 1718.8, 7.427764985515858, 4.613338408972741, 3.4454964532422196], "isController": false}, {"data": ["33 新增/修改/删除报价项目", 100, 0, 0.0, 1147.0900000000001, 200, 6534, 1567.4000000000005, 2982.899999999985, 6526.049999999996, 0.8684400211899365, 0.5393826694109372, 0.5325979817453907], "isController": false}, {"data": ["42 已选报价项目数", 100, 0, 0.0, 225.92999999999995, 103, 534, 378.20000000000005, 446.79999999999995, 533.6599999999999, 7.273785277858598, 8.062252236688973, 1.8468595432062846], "isController": false}, {"data": ["40 已选报价项目数", 100, 0, 0.0, 223.14999999999998, 56, 2116, 357.60000000000014, 584.2999999999994, 2104.419999999994, 0.8410216731285165, 0.9321871083992834, 0.2135406591927874], "isController": false}, {"data": ["52 接车单详情", 100, 0, 0.0, 1135.6300000000006, 275, 3932, 2225.0000000000005, 2555.1, 3924.159999999996, 0.7140001142400183, 1.5974358024647282, 0.2112715181784429], "isController": false}, {"data": ["29 已选报价项目数", 100, 0, 0.0, 146.36999999999995, 22, 1321, 243.40000000000003, 323.09999999999957, 1318.849999999999, 0.6083872263017965, 0.6743354510278702, 0.15447331917819054], "isController": false}, {"data": ["15 查询项目列表", 100, 0, 0.0, 774.3399999999997, 230, 2335, 1209.7000000000003, 1580.799999999999, 2331.8499999999985, 4.529190633633769, 23.84848866570044, 1.5392171293989763], "isController": false}, {"data": ["44 已选报价项目数", 100, 0, 0.0, 195.63, 69, 613, 290.20000000000005, 330.79999999999995, 612.2199999999996, 4.40257110152329, 4.879802929911069, 1.1178403187461479], "isController": false}, {"data": ["39 新增/修改/删除报价项目", 100, 0, 0.0, 1212.7000000000003, 333, 6943, 1396.7, 3613.8499999999885, 6934.409999999995, 0.8351428094204109, 0.5187019792884584, 0.49505047394354434], "isController": false}, {"data": ["04 根据车架号获取车型", 100, 0, 0.0, 276.54999999999995, 65, 841, 476.00000000000006, 500.0, 839.8599999999994, 0.6527415143603134, 0.5271652659921672, 0.16382282147519583], "isController": false}, {"data": ["53 已选报价项目列表接口", 100, 0, 0.0, 3554.42, 1510, 7226, 5194.8, 6286.649999999995, 7220.7599999999975, 0.6857440665994637, 11.926334907973146, 0.17478437635005864], "isController": false}, {"data": ["14 查询项目列表明细", 100, 0, 0.0, 213.71000000000006, 47, 1442, 301.1, 369.34999999999985, 1432.6799999999953, 0.6483696744535865, 0.5977157936369, 0.17602223583798537], "isController": false}, {"data": ["49 新增/修改/删除报价项目", 100, 0, 0.0, 2947.279999999999, 1006, 14327, 4050.6000000000004, 4435.749999999999, 14283.499999999978, 0.7029778140201896, 2.3478360585439924, 0.3226558326069229], "isController": false}, {"data": ["50 添加或修改接车单", 100, 17, 17.0, 1478.6799999999998, 362, 6476, 2336.2000000000003, 2589.0, 6463.609999999993, 0.7098693130594658, 0.4187258422599399, 0.874165238054674], "isController": false}, {"data": ["08 判断新客户0元推荐", 100, 0, 0.0, 165.79000000000002, 37, 467, 265.20000000000005, 385.3999999999992, 466.6399999999998, 0.5980610859593198, 0.3901414115437751, 0.1594440199872015], "isController": false}, {"data": ["51 前端埋点接口", 100, 0, 0.0, 358.34000000000003, 96, 1132, 707.6000000000001, 838.8999999999995, 1129.4199999999987, 0.7159221076746849, 0.4369641770475372, 0.34607562822164945], "isController": false}, {"data": ["05 客户来源字典接口", 100, 0, 0.0, 285.8300000000001, 50, 639, 421.5, 521.3499999999999, 638.7599999999999, 0.653727225777772, 3.835680656701685, 0.1519405075538181], "isController": false}, {"data": ["34 已选报价项目数", 100, 0, 0.0, 241.6399999999999, 56, 1436, 451.7000000000003, 974.3999999999951, 1434.0099999999989, 0.8735837024224476, 0.9682788107905058, 0.22180836194319958], "isController": false}, {"data": ["13 查询项目搜索", 100, 0, 0.0, 11425.100000000002, 1763, 33673, 14751.0, 29584.1, 33647.62999999999, 0.6001032177534535, 2.1490024409198383, 0.17463941297903238], "isController": false}, {"data": ["19 已选报价项目数", 100, 0, 0.0, 223.11, 85, 896, 419.2000000000001, 506.79999999999995, 893.3899999999987, 3.907776475185619, 4.3313733391949985, 0.9922088706525987], "isController": false}, {"data": ["20 查询项目列表", 100, 0, 0.0, 651.7400000000001, 267, 1435, 975.7, 1011.8, 1434.6299999999999, 3.8519317437695, 30.280847954624246, 1.3090549285466662], "isController": false}, {"data": ["17 已选报价项目数", 100, 0, 0.0, 182.35, 95, 489, 246.60000000000002, 278.29999999999984, 486.999999999999, 4.365096686891614, 4.838266347287092, 1.108325330656074], "isController": false}, {"data": ["37 保存活动转订单", 100, 1, 1.0, 1552.4599999999994, 242, 6850, 2368.8, 2676.0999999999995, 6848.079999999999, 0.8157072589788976, 0.9352513882317913, 0.3855491341267446], "isController": false}, {"data": ["15 已选报价项目数", 100, 0, 0.0, 202.38999999999996, 93, 582, 319.70000000000005, 417.1999999999996, 581.93, 4.521613311629589, 5.011749129589438, 1.1480658799059504], "isController": false}, {"data": ["03 获取送修人信息", 100, 0, 0.0, 12719.199999999995, 4572, 36030, 25853.70000000005, 31232.799999999996, 36014.62999999999, 0.6124336275056191, 0.3737998214755976, 0.1447352908753514], "isController": false}, {"data": ["21 新增/修改/删除报价项目", 100, 0, 0.0, 951.1600000000001, 52, 1896, 1460.3, 1694.3499999999983, 1894.7599999999993, 3.782720532607051, 2.3395609325351794, 2.419611278181268], "isController": false}, {"data": ["38 查询项目列表", 100, 0, 0.0, 3810.5299999999993, 678, 16675, 5513.800000000001, 7801.999999999994, 16655.73999999999, 0.8130874556867337, 179.95805008669544, 0.272352536426318], "isController": false}, {"data": ["47 已选报价项目数", 100, 0, 0.0, 176.5, 56, 709, 268.70000000000005, 310.34999999999985, 707.2299999999991, 0.6970778496542493, 0.77263999937263, 0.17699242276377428], "isController": false}, {"data": ["25 查询项目列表", 100, 0, 0.0, 10495.910000000005, 723, 52270, 27815.20000000006, 31936.449999999986, 52262.1, 0.5447275817363737, 0.33247533064964213, 0.18512226410572072], "isController": false}, {"data": ["35 查询项目列表", 100, 0, 0.0, 3597.41, 883, 13399, 6046.900000000001, 6515.899999999996, 13337.749999999969, 0.8123740820172873, 174.86264848675017, 0.27211358411321246], "isController": false}, {"data": ["30 查询项目分类-喷漆", 100, 0, 0.0, 554.0100000000003, 108, 3990, 794.7000000000003, 980.6499999999992, 3989.96, 0.8999766006083841, 5.525838750067498, 0.2478451185269183], "isController": false}, {"data": ["27 查询项目列表", 100, 0, 0.0, 6238.089999999998, 540, 31285, 10761.300000000001, 17380.149999999965, 31275.669999999995, 0.5771472764420025, 4.5704878986644815, 0.19726713550263758], "isController": false}, {"data": ["12 已选报价项目数", 100, 0, 0.0, 169.43999999999997, 35, 1013, 255.1000000000001, 360.95, 1008.4699999999978, 0.605987153072355, 0.6716752136104714, 0.1538639255847776], "isController": false}, {"data": ["36 线下活动列表", 100, 0, 0.0, 1251.5600000000006, 281, 5098, 2674.3000000000006, 3194.3999999999974, 5087.389999999995, 0.8144383633046651, 97.17974788296928, 0.22985613964360177], "isController": false}, {"data": ["23 查询项目分类-配件", 100, 0, 0.0, 352.30000000000007, 49, 2970, 599.5000000000002, 736.8999999999995, 2951.0799999999904, 0.5459051653546746, 32.60730469730924, 0.15033716467775218], "isController": false}, {"data": ["26 已选报价项目数", 100, 0, 0.0, 158.04999999999998, 23, 633, 255.40000000000003, 395.59999999999945, 630.979999999999, 0.5782419132868427, 0.640922433184147, 0.14681923579548742], "isController": false}, {"data": ["18 查询项目分类-工时", 100, 0, 0.0, 471.34000000000003, 172, 849, 727.0, 784.9, 848.7799999999999, 3.9060974180696064, 84.98432068083278, 1.0757026092730753], "isController": false}, {"data": ["16 新增/修改/删除报价项目", 100, 0, 0.0, 925.3, 368, 2207, 1256.4000000000003, 1363.3999999999996, 2205.349999999999, 4.317789291882556, 2.6817519430051813, 2.496221934369603], "isController": false}, {"data": ["24 已选报价项目数", 100, 0, 0.0, 146.09, 22, 1073, 267.5000000000001, 315.7499999999997, 1069.8699999999985, 0.5464242000349712, 0.6056557295309495, 0.1387405195401294], "isController": false}, {"data": ["10 已选报价项目数", 100, 0, 0.0, 162.47000000000003, 40, 577, 281.20000000000005, 314.1999999999998, 576.4199999999997, 0.6047740866399357, 0.6703306526721943, 0.15355592043592117], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 45, 100.0, 0.8333333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5400, 45, "400", 45, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["09 新增/修改/删除报价项目", 100, 27, "400", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["50 添加或修改接车单", 100, 17, "400", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 保存活动转订单", 100, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
