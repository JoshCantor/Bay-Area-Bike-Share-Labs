'use strict';

app.directive('chord', function() {
	return {
		scope: {
			'chordService': '=',
			'stationsService': '='
		},
		link: function(scope, element, attrs) {

			var chordServiceData = scope.chordService,
				stationsService = scope.stationsService,
				colors = ['#9C6744','#C9BEB9','#CFA07E','#C4BAA1','#C2B6BF','#7D4E4E','#8FB5AA','#85889E','#9C7989','#91919C','#436E55','#55719F','#99677B','#9A934F','#9EC472','#4A4A77','#A6571B','#7E5277','#918A59','#6E676C','#6E4752','#6B4A2F','#998476','#8A968D','#968D8A','#968D96','#CC855C', '#967860','#929488','#949278','#A0A3BD','#BD93A1','#546096','#6B5745','#A86951','#695C52','#56695E','#69545C','#565A69','#696043','#63635C','#636150','#333131','#332820','#302D30','#302D1F','#2D302F','#CFB6A3','#362F2A'];
			
			var createChordDiagram = function(chordData) {
				//row is start station, column is end station
				var matrix = chordData.matrix;

				var width = 1180,
				    height = 1180,
				    outerRadius = Math.min(width, height) / 2 - 315,
				    innerRadius = outerRadius - 24;

				var formatPercent = d3.format(".1%");

				var arc = d3.svg.arc()
				    .innerRadius(innerRadius)
				    .outerRadius(outerRadius);

				var layout = d3.layout.chord()
				    .padding(.04)
				    .sortSubgroups(d3.descending)
				    .sortChords(d3.ascending);

				var path = d3.svg.chord()
				    .radius(innerRadius);

				var svg = d3.select(".chord").append("svg")
					.attr("id", "svg")
				    .attr("width", width)
				    .attr("height", height)
				    .append("g")
				    .attr("id", "circle")
				    .attr("transform", "translate(" + width / 2 + "," + height / 3.05 + ")");

				svg.append("circle")
				    .attr("r", outerRadius);

				// Compute the chord layout.
				layout.matrix(matrix);

				// Add a group per neighborhood.
				var group = svg.selectAll(".group")
				  .data(layout.groups)
				  .enter().append("g")
				  .attr("class", "group")
				  .on("mouseover", mouseover);

				// Add a mouseover title.
				group.append("title").text(function(d, i) {
				return stationsService[i].name + ": " + formatPercent(d.value / chordData.totalTrips) + " of origins (" + d.value + ")";
				});

				// Add the group arc.
				var groupPath = group.append("path")
				  .attr("id", function(d, i) { return "group" + i; })
				  .attr("d", arc)
				  .style("fill", function(d, i) { return colors[i]; });

				group.append("title").text(function(d, i) {
				return stationsService[i].name + ": " + formatPercent(d.value / chordData.totalTrips) + " of origins (" + d.value + ")";
				});

				// Add the group arc.
				var groupPath = group.append("path")
				  .attr("id", function(d, i) { return "group" + i; })
				  .attr("d", arc)
				  .style("fill", function(d, i) { return colors[i]; });

				group.append("text")
				  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
				  .attr("dy", ".35em")
				  .style("font-family", "helvetica, arial, sans-serif")
				  .style("font-size", "10px")
				  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
				  .attr("transform", function(d) {
				    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				        + "translate(" + (outerRadius+5) + ")"
				        + (d.angle > Math.PI ? "rotate(180)" : "");
				  })
				  .text(function(d){
				  	var stationName = stationsService[d.index].name;
				  	if (stationName === "Yerba Buena Center of the Arts (3rd @ Howard)") stationName = "Yerba Buena Center";
				  	if (stationName === "Temporary Transbay Terminal (Howard at Beale)") stationName = "Temp. Transbay Term.";
				  	if (stationName === "Harry Bridges Plaza (Ferry Building)") stationName = "Ferry Building";
				  	if (stationName === "Mechanics Plaza (Market at Battery)") stationName = "Ferry Building";
				  	if (stationName === "Grant Avenue at Columbus Avenue") stationName = "Grant at Columbus";
				  	if (stationName === "Powell at Post (Union Square)") stationName = "Union Square";
				  	return stationName;
				  }); 

				// Add the chords.
				var chord = svg.selectAll(".chord")
				  .data(layout.chords)
				  .enter().append("path")
				  .attr("class", "chord")
				  .style("fill", function(d) { return colors[d.source.index]; })
				  .attr("d", path);

				//Add an elaborate mouseover title for each chord.
				chord.append("title").text(function(d) {
				return stationsService[d.source.index].name
				    + " → " + stationsService[d.target.index].name
				    + ": " + formatPercent(d.source.value / chordData.totalTrips) + " (" + d.source.value + ")"
				    + "\n" + stationsService[d.target.index].name
				    + " → " + stationsService[d.source.index].name
				    + ": " + formatPercent(d.target.value / chordData.totalTrips) + " (" + d.target.value + ")";
				});

				function mouseover(d, i) {
					chord.classed("fade", function(p) {
					  return p.source.index != i
					      && p.target.index != i;
					});
				}
			}

			scope.$on('matrixUpdate', function(event, args) {
				if (document.getElementById('svg')) document.getElementById('svg').remove(0);
				createChordDiagram(scope.chordService);
			});
		}
	}
});


