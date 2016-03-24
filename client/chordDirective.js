'use strict';

app.directive('chord', function() {
	return {
		scope: {
			'chordService': '=',
			'stationsService': '='
		},
		link: function(scope, element, attrs) {

			var chordService = scope.chordService,
				stationsService = scope.stationsService,
				colors = ['#9C6744','#C9BEB9','#CFA07E','#C4BAA1','#C2B6BF','#121212','#8FB5AA','#85889E','#9C7989','#91919C','#242B27','#212429','#99677B','#36352B','#33332F','#2B2B2E','#2E1F13','#2B242A','#918A59','#6E676C','#6E4752','#6B4A2F','#998476','#8A968D','#968D8A','#968D96','#CC855C', '#967860','#929488','#949278','#A0A3BD','#BD93A1','#65666B','#6B5745','#6B6664','#695C52','#56695E','#69545C','#565A69','#696043','#63635C','#636150','#333131','#332820','#302D30','#302D1F','#2D302F','#CFB6A3','#362F2A'],
				totalTrips = 0;
			
			chordService.forEach(function(row){
				row.forEach(function(column){
					totalTrips += column
				});
			});

			var createChordDiagram = function(chordMatrix) {
				//row is start station, column is end station
				var matrix = chordMatrix;

				var width = 1180,
				    height = 1180,
				    outerRadius = Math.min(width, height) / 2 - 250,
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
				    .attr("transform", "translate(" + width / 2 + "," + height / 2+ ")");

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
				return stationsService[i].name + ": " + formatPercent(d.value / totalTrips) + " of origins";
				});

				// Add the group arc.
				var groupPath = group.append("path")
				  .attr("id", function(d, i) { return "group" + i; })
				  .attr("d", arc)
				  .style("fill", function(d, i) { return colors[i]; });

				group.append("title").text(function(d, i) {
				return stationsService[i].name + ": " + formatPercent(d.value / totalTrips) + " of origins";
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
				  .style("font-size", "12px")
				  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
				  .attr("transform", function(d) {
				    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				        + "translate(" + (outerRadius+5) + ")"
				        + (d.angle > Math.PI ? "rotate(180)" : "");
				  })
				  .text(function(d){return stationsService[d.index].name;}); 

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
				    + ": " + formatPercent(d.source.value / totalTrips)
				    + "\n" + stationsService[d.target.index].name
				    + " → " + stationsService[d.source.index].name
				    + ": " + formatPercent(d.target.value / totalTrips);
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


