const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
    .then(response => response.json())
    .then(thejson => {
        // Fetching the data
        const GDPData = thejson.data;
        console.log(GDPData);
        
        // Lay out canvas, padding, scales and axes
        const svgH = 600; svgW = 900, padding = 60;
        
        const xScale = d3.scaleTime()
                         .domain([d3.min(GDPData, d => new Date(d[0])), d3.max(GDPData, d => new Date(d[0]))])
                         .range([padding, svgW - padding]);
        const yScale = d3.scaleLinear()
                         .domain([0, d3.max(GDPData, d => d[1])])
                         .range([svgH, padding]);
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        
        // Append SVG element
        const svg = d3.select('#bar-chart')
                      .append('svg')
                      .attr('width', svgW)
                      .attr('height', svgH)
                      .text(yScale(243));
        
        // Set up axes
        svg.append('g')
           .attr('id', 'x-axis')
           .attr('transform', `translate(0, ${svgH})`)
           .call(xAxis);
        svg.append('g')
           .attr('id', 'y-axis')
           .attr('transform', `translate(${padding}, 0)`)
           .call(yAxis);
        
        // Rendering the bars
        svg.selectAll('rect')
           .data(GDPData).enter()
           .append('rect')
           .attr('x', d => xScale(new Date(d[0])))
           .attr('y', d => yScale(d[1]))
           .attr('width', svgW / GDPData.length)
           .attr('height', d => d[1])
           .attr('class', 'bar')
           .append('title')
           .text(d => `${d[0]}\n${d[1]}`)
    });
});