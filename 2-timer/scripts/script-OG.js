const margins = {t: 50, r: 50, b: 50, l: 50};
const SVGsize = {w: window.innerWidth*0.8, h: window.innerHeight*0.8};
const size = {
    w: SVGsize.w - margins.l - margins.r,
    h: SVGsize.h - margins.t - margins.b
};
const svg = d3.select('svg')
    .attr('width', SVGsize.w)
    .attr('height', SVGsize.h);
const containerG = svg.append('g')
    .attr('transform', `translate(${margins.l}, ${margins.t})`);


let data, scaleY, scaleX, scaleDuration;

d3.csv('data/population.csv')
.then(function(popData) {
    data = popData;
    console.log(data[0]);
    data.forEach(parseData);

    data.sort((a, b) => +a[2019] < +b[2019]);
    data = data.slice(0, 40);
    console.log(data);

    scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[2019])])
        .range([size.h, 0]);

    scaleX = d3.scaleBand()
        .domain(data.map(d => d.code))
        .range([0, size.w]);

    let axisX = d3.axisBottom(scaleX);
    let axisXG = containerG.append('g')
        .classed('axis-x', true)
        .attr('transform', `translate(0, ${size.h})`)
        .call(axisX);

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
        if (currYear > 2019) {
            t.stop();
            return;
        }
        currYear++;
        draw(currYear);
    }, 500);

});

function parseData(d) {
    for (let i = 1960; i < 2020; i++) {
        d[i] = +d[i];
    }
}

function draw(year = 1960) {

    containerG.select('text.year')
        .text(year);

    let rectSel = containerG.selectAll('rect')
        .data(data, d => d.code);

    rectSel
        .enter()
        .append('rect')
        .attr('y', size.h)
        .attr('height', 0)
        .attr('x', d => scaleX(d.code))
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
}
