const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
    .then(response => response.json())
    .then(thejson => {
        // Fetching the data
        const GDPData = thejson.data;
        console.log(GDPData)
        
        // Lay out canvas, padding, scales and axes
        const svgH = 500; svgW = 900, padding = 50;
        
        const xScale = d3.scaleLinear()
                         .domain([d3.min(GDPData, d => new Date(d[0]).getFullYear()), d3.max(GDPData, d => new Date(d[0]).getFullYear())])
                         .range([padding, svgW - padding]);
        const yScale = d3.scaleLinear()
                         .domain([d3.min(GDPData, d => d[1]), d3.max(GDPData, d => d[1])])
                         .range([svgH - padding, padding]);
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        
        // Append SVG element
        const svg = d3.select('#bar-chart')
                      .append('svg')
                      .attr('width', svgW)
                      .attr('height', svgH);
        
        // Set up axes
        svg.append('g')
           .attr('id', 'x-axis')
           .attr('transform', `translate(0, ${svgH - padding})`)
           .call(xAxis);
        svg.append('g')
           .attr('id', 'y-axis')
           .attr('transform', `translate(${padding}, 0)`)
           .call(yAxis);
    });
});