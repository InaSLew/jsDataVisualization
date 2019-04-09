const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
    .then(response => response.json())
    .then(thejson => {
        // Fetching the data
        const GDPData = thejson.data;
        console.log(GDPData);
        
        // Lay out canvas, padding, scales and axes
        const margin = 60;
        const width = 1000 - 2 * margin;
        const height = 600 - 2 * margin;

        // Select svg element
        const svg = d3.select('#data-viz')
            .append('svg')
            .attr('width', width + 2 * margin)
            .attr('height', height + 2 * margin);
        
        // tooltip preparation
        let tooltip = d3.select('#data-viz')
                    .append('div')
                    .attr('id', 'tooltip')
                    .attr('class', 'tooltip')
                    .style('opacity', 0)
                    .style('background-color', 'black')
                    .style('border-radius', '5px')
                    .style('padding', '10px')
                    .style('color', 'white');

        // Define a Chart
        const chart = svg.append('g')
            .attr('id', 'bar-chart')
            .attr('transform', `translate(${margin}, ${margin})`);
        
        // Set up x and y scales
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(GDPData, d => d[1])]);
        chart.append('g')
            .attr('id', 'y-axis')
            .call(d3.axisLeft(yScale));
        
        const xScale = d3.scaleTime()
            .range([0, width])
            .domain([d3.min(GDPData, d => new Date(d[0])), d3.max(GDPData, d => new Date(d[0]))])
        chart.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
        
        // Draw the bars
        chart.selectAll('rect')
            .data(GDPData)
            .enter()
            .append('rect')
            .attr('x', d => xScale(new Date(d[0])))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => height - yScale(d[1]))
            .attr('width', width / GDPData.length)
            .attr('class', 'bar')
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])
            .on('mouseover', (d, i) => {
                tooltip.transition().duration(200);
                tooltip.style('opacity', 1)
                    .html(`${d[0]}\n${d[1]}`)
                    .style('left', (i * (width / GDPData.length)) + 30 + 'px')
                    .style('top', height - 100 + 'px')
                    .attr('data-date', d[0]);
            })
            .on('mouseout', d => {
                tooltip.transition().duration(200).style('opacity', 0);
            })
        
        svg.append('text')
            .attr('id', 'title')
            .attr('x', width / 2)
            .attr('y', margin * 2)
            .attr('text-anchor', 'middle')
            .style('font-size', 30)
            .style('font-family', 'Arial, Helvetica, sans-serif')
            .text('United States GDP')
    });
});