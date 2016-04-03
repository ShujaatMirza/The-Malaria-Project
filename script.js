function drawGraph(){
  var data;
  d3.csv("text2.csv", function(csv){
    //console.log(csv);
    //console.log(d3.keys(csv[0]));

    //color scale
    scale = colorbrewer.PuBuGn[3].reverse().concat(colorbrewer.OrRd[3]);

    //Extract Yearss
    years = d3.keys(csv[0])
            .filter(function(d) {
              return d.match(20);
            })
            .map(function(d) {
              return parseInt(d,0);
            });
    
    var min_year =d3.min(years);
    var max_year =d3.max(years);
    //console.log(min_year);
    //console.log(max_year);

    // Starting year
    var year = min_year;

    // Extract min/max values from the whole dataset
    var values = d3.merge(csv
                 .map(function(d) { return d3.entries(d).filter(function(d) { return d.key.match(20); }); })
                 .map(function(d) { return d.map(function(d) { return d.value; }); })
                 .map(function(d) { return d.map(function(d) { return parseFloat(d); }); })
                 .map(function(d) { return d.filter(function(d) { return !isNaN(d); }); })
             );

    // Define color scale 
    var color = d3.scale.quantile()
                .domain([d3.min(values),d3.max(values)])
                .range(scale);

    //The SVG Container
    var width = 960,
        height = 500,
        centered;

    var projection = d3.geo.patterson()
                    .scale(153)
                    .translate([width / 2, height / 2])
                    .precision(0.1);

    var path = d3.geo.path()
              .projection(projection);

    var graticule = d3.geo.graticule();

    var svg = d3.select("#graph").append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("class",'block');

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    var g = svg.append("g");

    d3.select(self.frameElement).style("height", height + "px");
 
       //The Map creation using d3 projection 
    d3.json("worldData.json", function(error,worldData){
      
      var countries = d3.select("g#countries").empty() ?
                    g.append("g").attr("id", "countries") : d3.select("g#countries"),
      
      country = countries
                .selectAll("path")
                .data(world_countries.features);

      country.enter()
              .append("path")
              .classed("country", true)
              .attr("id", function(d,i) { return d.id; })
              .attr("title", function(d,i) { return d.properties.name; })
              .attr("d", path)
              .attr("class", "land")
              .on("click", clicked)
              .on("mouseover", function (d) {
                    //console.log(d);
                    tip.show(d);
                    d3.select(this)
                      .transition()
                      .duration(100)
                      .style('stroke','black')
                      .style('stroke-width', '1.5px');
                  })
              .on("mouseout", function () {
                    tip.hide();
                    d3.select(this)
                      .transition()
                      .duration(100)
                      .style('stroke','white')
                      .style('stroke-width', '0.3px');
                  });
              
      //zoom function written by Mike Bostock
      function clicked(d) {
        var x, y, k;

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }
        g.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

        g.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
      }
     

      // build the map legend
      var legend = d3.select("body")
          .append('ul')
          .attr('class', 'list-inline')
          .attr('x',0)
          .attr('y',300);


      var keys = legend.selectAll('li.key')
          .data(color.range());

      var legend_items = ["Medium", "", "", "","", "Very High"];
      //console.log('Hello');
      keys.enter().append('li')
          .attr('class', 'key')
          .style('border-top-color', String)
          .text(function (d, i) {
              return legend_items[i];
            });


      function update(){

        if ( year < min_year ) year = max_year;
        if ( year > max_year ) year = min_year;
  
        // Code to change the color of current Year in the header
        $(".y").each(function( index ) {
          var a= $(this).text();
          if (a == year) {
            $(this).css({'color':'#259286','opacity':'1','font-size':'2.3em'});
          } else{
            $(this).css({'color':'#1EB300', 'opacity':'0.5','font-size':'2em'});
          }
        });

        //extracting data from csv file
        data = csv.map(function(d){
                    var curObj = {};
                    var curCountry = d.Country;
                    var yearValue = d[" "+year];
                    curObj[curCountry] = yearValue;
                    return curObj;
                  });

        //Adding colors based on the color scale
        country
          .transition()
          .duration(250)
          .style("fill",  function(d) {
                  //console.log('Here is data');
                  var theName = d.properties.name;
                  var curColorVal;
                  data.forEach(function(theObj){
                    if (theObj[theName]){
                          //console.log("Yes!!!!!!!!");
                          //console.log((theObj[theName]));
                          curColorVal = color(theObj[theName]);
                    }
                  });
                  return curColorVal;
                });
      }

      update();

      // tooltip to display info
      var tip = d3.tip()
              .attr('class','d3-tip')
              .offset([0, 10])
              .html( function (d) {
                var theName= d.properties.name;
                var cases;
                data.forEach(function(theObj){
                      if (theObj[theName]){
                            cases = theObj[theName];
                      }
                });

                if (cases === undefined){
                  cases="No Cases Reported!";
                }
                return'<span class = toolTip >' +
                      '<b> Country: '+theName+'</b> <br/>'+
                      '<b> Year: '+year+'</b> <br/>'+
                      '<span class = caseReported>'+
                      '<b> Cases Reported: '+cases + '</span>'+
                      '</span>';
              });

      svg.call(tip);

      // To check if right or left keys have been pressed
      d3.select(window).on("keydown", function() {
  
            switch (d3.event.keyCode) {
              //console.log(key);
              case 37:
                  year = parseInt(year)-1;
                  update();
                  console.log(year);
                  break;

              case 39:
                  year = parseInt(year)+1;
                  update();
                  console.log(year);
                  break;
            }
      });

      //Auto play (snippet of Code from Internet)
      var playing = false,
      loop    = null;
       
      d3.select("#autoplay").on("click", function() {
        year=1999;
        d3.event.preventDefault();
        if (playing) {
          playing = false;
          clearInterval(loop);
          return d3.select(d3.event.target).text("Autoplay");
        } else {
          playing = true;
          loop    = setInterval( function() { year += 1; update(); }, 1000 );
          return d3.select(d3.event.target).text("Stop Autoplay");
          }
        
      });

      // Year Selection functionality 
      d3.selectAll(".y")
                .on("click", function() {
                  d3.selectAll('a')
                  .classed('active',false);
                  d3.select(this).classed("active",true);
                  year = this.getAttribute("value");

                  //code to see if autoplay is active
                  if (playing === true){
                    playing = false;
                    clearInterval(loop);
                    year = this.getAttribute("value");
                    update();
                    return d3.select('#autoplay').text("autoplay");
                  }
                  update();
                });
      
    });

  });
}

$(document).ready(function(){
	drawGraph();

});

