
var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(iqr(1.5))
    .width(width)
    .height(height);

d3.json("http://happyhomes-api.herokuapp.com/stats/getStats?location_id=18&dow=1&hour=12", function(error, json) {
  var data = [];

  data.push(json.rawData);
	min = json.min
	max = json.max

  chart.domain([min, max]);

  var svg = d3.select("body").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "box")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  setInterval(function() {
    svg.datum(update).call(chart.duration(1000));
  }, 60 * 1000);
});

function update(d) {
	d3.json("http://happyhomes-api.herokuapp.com/stats/getStats?location_id=18&dow=1&hour=12", function(error, json) {
	  var data = [];

	  data.push(json.rawData);
		min = json.min
		max = json.max
	
		return data;
	})
	
}

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}