<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">
    google.load('visualization', '1.0', {'packages':['corechart', 'gauge', 'geomap']});
    google.setOnLoadCallback(drawChart);

    Rui.onReady(function() {
    function drawChart() {
        var data1 = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Memory', 80],
            ['CPU', 55],
            ['Network', 68]
        ]);

        var options1 = {
            width: 300, height: 150,
            redFrom: 90, redTo: 100,
            yellowFrom:75, yellowTo: 90,
            minorTicks: 5
        };

        var chart1 = new google.visualization.Gauge(document.getElementById('chart1'));
        chart1.draw(data1, options1);
        
        var data2 = new google.visualization.DataTable();
        data2.addColumn('string', 'Topping');
        data2.addColumn('number', 'Slices');
        data2.addRows([
            ['Mushrooms', 3],
            ['Onions', 1],
            ['Olives', 1],
            ['Zucchini', 1],
            ['Pepperoni', 2]
        ]);

        var options2 = {'title':'How Much Pizza I Ate Last Night', 'width': 300, 'height': 150};

        var chart2 = new google.visualization.PieChart(document.getElementById('chart2'));
        chart2.draw(data2, options2);

        var data3 = google.visualization.arrayToDataTable([
            ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
            ['2004/05',  165,      938,         522,             998,           450,      614.6],
            ['2005/06',  135,      1120,        599,             1268,          288,      682],
            ['2006/07',  157,      1167,        587,             807,           397,      623],
            ['2007/08',  139,      1110,        615,             968,           215,      609.4],
            ['2008/09',  136,      691,         629,             1026,          366,      569.6]
        ]);

        var chart3 = new google.visualization.ComboChart(document.getElementById('chart3'));
        chart3.draw(data3, {
            title : 'Monthly Coffee Production by Country',
            width: 300,
            height: 150,
            vAxis: {title: "Cups"},
            hAxis: {title: "Month"},
            seriesType: "bars",
            series: {5: {type: "line"}}
        });

        var data4 = google.visualization.arrayToDataTable([
            ['Country', 'Popularity'],
            ['Germany', 200],
            ['United States', 300],
            ['Brazil', 400],
            ['Canada', 500],
            ['France', 600],
            ['RU', 700]
        ]);

        var chart4 = new google.visualization.GeoMap(document.getElementById('chart4'));
        chart4.draw(data4, {
            width: 300,
            height: 150
        });
    }
</script> 