
function drawPyramid(sites){
    mmdata = [];
    for(var i = 0; i < sites.length+1; i++){
        mmdata.push({mismatches:i.toString(), vaccine:0, placebo:0});
        }
    for(var patient in seqID_lookup){
        if(seqID_lookup[patient].mismatch != undefined){
          mmcount = 0;
          for(var i = 0; i < sites.length; i++){
              mmcount += seqID_lookup[patient].mismatch[sites[i]]; 
          }
          if(seqID_lookup[patient].vaccine){
              mmdata[mmcount].vaccine += 1;
          } else {
              mmdata[mmcount].placebo += 1;
          }
        }
        
    }
    var w = 300,
        h = 150;
        
    // margin.middle is distance from center line to each y-axis
    var margin = {
      top: 20,
      right: 20,
      bottom: 24,
      left: 20,
      middle: 20
    };
        
    // the width of each side of the chart
    var regionWidth = w/2 - margin.middle;

    // these are the x-coordinates of the y-axes
    var pointA = regionWidth,
        pointB = w - regionWidth;
    
    

    // find the maximum data value on either side
    //  since this will be shared by both of the x-axes
    var maxValue = Math.max(
      d3.max(mmdata, function(d) { return d.vaccine; }),
      d3.max(mmdata, function(d) { return d.placebo; })
    );
      
    // CREATE SVG
    var svg = d3.select('body').append('svg')
      .attr('width', margin.left + w + margin.right)
      .attr('height', margin.top + h + margin.bottom)
      // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
      .append('g')
        .attr('transform', translation(margin.left, margin.top));  
      
    // the xScale goes from 0 to the width of a region
    //  it will be reversed for the left x-axis
    var xScale = d3.scale.linear()
      .domain([0, maxValue])
      .range([0, regionWidth])
      .nice();

    var xScaleLeft = d3.scale.linear()
      .domain([0, maxValue])
      .range([regionWidth, 0]);

    var xScaleRight = d3.scale.linear()
      .domain([0, maxValue])
      .range([0, regionWidth]);

    var yScale = d3.scale.ordinal()
      .domain(mmdata.map(function(d) { return d.mismatches; }))
      .rangeRoundBands([h,0], 0.1);

    var yAxisLeft = d3.svg.axis()
      .scale(yScale)
      .orient('right')
      .tickSize(4,0)
      .tickPadding(margin.middle-4);

    var yAxisRight = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .tickSize(4,0)
      .tickFormat('');

    var xAxisRight = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(d3.format(''));

    var xAxisLeft = d3.svg.axis()
      .scale(xScale.copy().range([pointA, 0]))
      .orient('bottom')
      .tickFormat(d3.format(''));

    var leftBarGroup = svg.append('g')
      .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
    var rightBarGroup = svg.append('g')
      .attr('transform', translation(pointB, 0));

    svg.append('g')
      .attr('class', 'axis y left')
      .attr('transform', translation(pointA, 0))
      .call(yAxisLeft)
      .selectAll('text')
      .style('text-anchor', 'middle');

    svg.append('g')
      .attr('class', 'axis y right')
      .attr('transform', translation(pointB, 0))
      .call(yAxisRight);

    svg.append('g')
      .attr('class', 'axis x left')
      .attr('transform', translation(0, h))
      .call(xAxisLeft);

    svg.append('g')
      .attr('class', 'axis x right')
      .attr('transform', translation(pointB, h))
      .call(xAxisRight);

    leftBarGroup.selectAll('.bar.left')
      .data(mmdata)
      .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', 0)
        .attr('y', function(d) {return yScale(d.mismatches); })
        .attr('width', function(d) { return xScale(d.vaccine); })
        .attr('height', yScale.rangeBand())
        .style("fill","red");

    rightBarGroup.selectAll('.bar.right')
      .data(mmdata)
      .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 0)
        .attr('y', function(d) { return yScale(d.mismatches); })
        .attr('width', function(d) { return xScale(d.placebo); })
        .attr('height', yScale.rangeBand()).style("fill","blue");
    }
function translation(x,y) {
  return 'translate(' + x + ',' + y + ')';
  }