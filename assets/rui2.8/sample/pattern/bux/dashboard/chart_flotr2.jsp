<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<script type="text/javascript" src="./../../../../../Flotr2-master/flotr2.js"></script>
<script type="text/javascript" src="./../../../../../Flotr2-master/js/flashcanvas.js"></script>
<style type="text/css">
.ux-chart-title {
    border-bottom: 2px solid #c5003d;
    height: 50px;
}

.ux-chart {
    margin-top: 15px;
    padding-bottom: 17px;
    clear: both;
    border-bottom: 2px solid #dddddd;
    margin-bottom: 52px;
}

.ux-chart-wrap {
    width: 33%;
    display: inline-block;
    *display: inline;
    *zoom: 100%;
}

.chart {
    width: 300px;
    height: 150px;
    margin: auto;
}

#chart1 {
    margin-left: 0px;
}

</style>
<script type="text/javascript">
    Rui.onReady(function() {
        var d1 = [[0, 58]], 
            d2 = [[0, 109]], 
            d3 = [[0, 68]], 
            d4 = [[0, 66]],
            d5 = [[0, 29]], 
            graph;

        graph = Flotr.draw(Rui.getDom('chart1'), 
            [
                { data: d1, label : '휴대폰' },
                { data: d2, label : '냉장고' },
                { data: d3, label : '세탁기' },
                { data: d4, label : 'TV', pie: { explode: 25 } },
                { data: d5, label : '에어컨' }
            ], {
                HtmlText: false,
                grid: { verticalLines: false, horizontalLines: false },
                xaxis: { showLabels: false },
                yaxis: { showLabels: false },
                pie: { show: true, explode: 6 },
                mouse: { track: true },
                legend: { position: 'se', backgroundColor: '#D2E8FF' }
            }
        );

        var horizontal = (horizontal ? true : false), // Show horizontal bars
        d1 = [[1,9],[2,15],[3,17],[4,17]],
        d2 = [[1,24],[2,29],[3,29],[4,27]],
        d3 = [[1,15],[2,14],[3,29],[4,10]],
        d4 = [[1,15],[2,15],[3,9],[4,27]],
        d5 = [[1,4],[2,8],[3,10],[4,7]],
        graph, i;


		Flotr.draw(Rui.getDom('chart2'),[
			{ data: d1, label : '휴대폰'},
			{ data: d2, label : '냉장고' },
			{ data: d3, label : '세탁기' },
			{ data: d4, label : 'TV' },
			{ data: d5, label : '에어컨' }
		], {
		  legend : {
		    backgroundColor : '#D2E8FF' // Light blue
		  },
          xaxis: {
              tickDecimals:0
            },
            yaxis: {
                   tickDecimals:0
            }, 
		  bars : {
		    show : true,
		    stacked : true,
		    horizontal : horizontal,
		    barWidth : 0.7,
		    lineWidth : 1,
		    shadowSize : 0
		  },
		  grid : {
		    verticalLines : horizontal,
		    horizontalLines : !horizontal
		  },
          legend: {
              noColumns: 3
          },
		  title:'주간별 판매량'
		});
        
		  var
	        d1 = [[1,9],[2,15],[3,17],[4,17]],
	        d2 = [[1,24],[2,29],[3,29],[4,27]],
	        d3 = [[1,15],[2,14],[3,29],[4,10]],
	        d4 = [[1,15],[2,15],[3,9],[4,27]],
	        d5 = [[1,4],[2,8],[3,10],[4,7]],
		    i, graph;

		  // Draw Graph
		  graph = Flotr.draw(Rui.getDom('chart3'),[
				{ data: d1, label : '휴대폰'},
				{ data: d2, label : '냉장고' },
				{ data: d3, label : '세탁기' },
				{ data: d4, label : 'TV' },
				{ data: d5, label : '에어컨' }
             ], {
		    xaxis: {
		      tickDecimals: 0
		    },
		    yaxis: {
		           tickDecimals: 0,
		           autoscaleMargin: 10
		    }, 
		    grid: {
		      minorVerticalLines: true
		    },
		    title: '주간별 주문량 추이'
		  });

		  var width = Rui.util.LDom.getViewportWidth();
		  if(width > 1400) {
			  Rui.select('.ux-chart-wrap').setStyle('width', '25%');
			  Rui.select('.chart4').show().setStyle('width', '24%');
			  Rui.get('chart4').setStyle('margin-right', '0px');

	          var
	            horizontal = (horizontal ? true : false), 
	            d1 = [[1,67],[2,81],[3,94],[4,88]],
	            d2 = [[1.5,70],[2.5,70],[3.5,80],[4.5,80]],
	            point;                                    
	                      
	          Flotr.draw(Rui.getDom('chart4'),[
	               { data: d1, label : '주별주문량'},
	               { data: d2, label : '주간별목표'}
	            ], {
	              bars : {
	                show : true,
	                horizontal : horizontal,
	                shadowSize : 0,
	                barWidth : 0.5
	              },
	              mouse : {
	                track : true,
	                relative : true
	              },
	                xaxis: {
	                  tickDecimals: 0
	                },
	              yaxis : {
	                min : 0,
	                tickDecimals: 0,
	                autoscaleMargin : 1
	              },
	              markers: {
	                  show: true
	              },
	              legend: {
	                  position: 'sw'
	              },
	             title:'목표대비 실적'
	            }
	          );
		  } else {
			  Rui.get('chart3').setStyle('margin-right', '0px');
		  }
    });
</script> 