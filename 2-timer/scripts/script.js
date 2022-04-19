const margins = {t: 25, r: 0, b: 250, l: 120};
const SVGsize = {w: window.innerWidth*0.8, h: window.innerHeight};
const size = {
    w: SVGsize.w - margins.l - margins.r,
    h: SVGsize.h - margins.t - margins.b
};
const svg = d3.select('svg')
.attr("class", "chart")
.attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight)
.attr("preserveAspectRatio", "xMidYMid meet")
    // .attr('width', SVGsize.w)
    // .attr('height', SVGsize.h);
const containerG = svg.append('g')
    .attr('transform', `translate(${margins.l}, ${margins.t})`);


let data, scaleY, scaleX, scaleDuration;

const tooltip = d3.select(".chart")
.append("div")
.attr("class", "barTooltip");

d3.csv('data/population.csv')
.then(function(popData) {
    data = popData;
    console.log(data[0]);
    data.forEach(parseData);

    data.sort((a, b) => +a[2019] <  +b[2019]);
    data = data.slice(0, 40);
    console.log(data);

    scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[2019])])
        .range([size.h, 0]);

    scaleX = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, size.w]);

    let axisX = d3.axisBottom(scaleX);
    let axisXG = containerG.append('g')
        .classed('axis-x', true)
        .attr('transform', `translate(0, ${size.h})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");;;

    let axisY = d3.axisLeft(scaleY);
    let axisYG = containerG.append('g')
        .classed('axis-y', true)
        .call(axisY);

    containerG.append('text')
        .classed('year', true)
        .attr('transform', `translate(${size.w}, 0)`)
        .text(1960)
    draw();

    let currYear = 1960;
    let t = d3.interval(function() {
        if ( currYear >= 2019) {
            //t.stop();
            // t.restart();
            currYear = 1960
        return;
    
    }
    currYear++
    draw(currYear);
    }, 1000);

});

function parseData(d) {
    for (let i = 1960; i < 2019; i++) {
        d[i] = +d[i];
    }
}

function draw(year = 1960) {



    let rectSel = containerG.selectAll('rect')
        .data(data, d => d.name);



    const popRange = {
            min: d3.min(data, function (d) { return d[year]; }),
            max: d3.max(data, function (d) { return d[year]; })
        };

        // console.log(popRange)
        // https://github.com/d3/d3-scale-chromatic

var colorScale = d3.scaleSequential()
//   .domain([0, 7000002002])
  .domain([popRange.min, popRange.max])
//   .interpolator(d3.interpolateRdPu);
  .interpolator( d3.interpolateBlues);


  containerG.select('text.year')
  .data(data)
      .text(year)
      .attr("transform", `translate(${size.w*2/3},${size.h/3})`)
      .style("font-size", "52px")
      .style("fill", function(d) {return colorScale(d[year])});






    rectSel
        .enter()
        .append('rect')
        .attr('y', size.h)
        .attr('height', 0)
        .attr('fill', function(d) {return colorScale(d[year])})
        .attr("stroke", "white")
        .attr("stroke-width", 0.7)
        .attr('x', d => scaleX(d.name))
        .attr('width', scaleX.bandwidth())
        .transition()
        .duration(500)
        .attr('y', d => scaleY(d[year]))
        .attr('height', d => size.h - scaleY(d[year]));

        
    
    rectSel
        .transition()
        .duration(500)
        .attr('y', d => scaleY(d[year]))
        .attr('height', d => size.h - scaleY(d[year]));

        svg.selectAll("rect")
        .on("mouseover", function (e, d) { //first argument e referes to the circle, d refers to datum!
            let x = e.offsetX;
            let y = e.offsetY;


            tooltip.style("visibility", "visible")
                .style("left", `${x}px`)
                .style("top", `${y}px`)
                           .html(`<b>${d[year]} ha
                        <br>${year} ${d.name} </b>`);

            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 1);

        }).on("mouseout", function () {

            tooltip.style("visibility", "hidden")
                .style("pointer-events", "none");


            d3.select(this)
            .attr("stroke", "white")
                // .attr("stroke", "white")
                .attr("stroke-width", 0.7)
            // .attr("stroke-opacity", 0.5);

        });




}
