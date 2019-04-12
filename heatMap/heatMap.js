/**
 * temperature palette 
#ffffcc
#ffeda0
#fed976
#feb24c
#fd8d3c
#fc4e2a
#e31a1c
#bd0026
#800026
 */
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
        .then(res => res.json())
        .then(rawdata => {
            console.log(rawdata);

            const baseTemp = rawdata.baseTemperature,
                  dataset = rawdata.monthlyVariance;

            const margin = 60,
                  width = 1300 - 2 * margin,
                  height = 600 - 2 * margin;
            
            const cellSize = Math.floor(width / dataset.length),
                  legendCellWidth = cellSize * 2,
                  buckets = 9
                  legendColors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026','#800026'];

            // Placeholder for tooltip

            const formatMonth = d3.timeFormat('%B')
                  MONTHS = 12;
            
            const svg = d3.select('#data-viz')
                .append('svg')
                .attr('width', width + 2 * margin)
                .attr('height', height + 2 * margin);
            const chart = svg.append('g')
                .attr('transform', `translate(${margin}, ${margin})`);
            
            const yScale = d3.scaleTime()
                .range([0, height])
                .domain([d3.min(dataset, d => new Date().setMonth(d.month - 1)), d3.max(dataset, d => new Date().setMonth(d.month - 1))]);
            chart.append('g')
                .attr('id', 'y-axis')
                .call(d3.axisLeft(yScale).tickFormat(formatMonth));

            const xScale = d3.scaleTime()
                .range([0, width])
                .domain([d3.min(dataset, d => new Date().setFullYear(d.year)), d3.max(dataset, d => new Date().setFullYear(d.year))]);
            chart.append('g')
                .attr('id', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(10)));

        });
});