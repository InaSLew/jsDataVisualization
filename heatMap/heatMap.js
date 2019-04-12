const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
        .then(res => res.json())
        .then(rawdata => {
            console.log(rawdata);

            const baseTemp = rawdata.baseTemperature,
                  dataset = rawdata.monthlyVariance,
                  margin = 60,
                  width = 1300 - 2 * margin,
                  height = 600 - 2 * margin,
                  formatMonth = d3.timeFormat('%B'),
                  allMonths = 12,
                  legendColors = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
            
            const svg = d3.select('#data-viz')
                .append('svg')
                .attr('width', width + 2 * margin)
                .attr('height', height + 2 * margin);
            const chart = svg.append('g')
                .attr('transform', `translate(${margin}, ${margin})`);
            
            const yScale = d3.scaleTime()
                .range([0, height])
                .domain([new Date(2019, 0, 1), new Date(2019, 11, 31)]);
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

            const colorScale = d3.scaleQuantile()
                .range(legendColors)
                .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)]);

            chart.selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('class', 'cell')
                .attr('data-month', d => d.month - 1)
                .attr('data-year', d => d.year)
                .attr('data-temp', d => d.variance)
                .attr('x', d => xScale(new Date().setFullYear(d.year)) + 1)
                .attr('y', d=> yScale(new Date().setMonth(d.month - 1)) - 16)
                .attr('width', Math.floor(width / 263))
                .attr('height', height / allMonths)
                .attr('fill', d => colorScale(d.variance));

            svg.append('text')
                .attr('id', 'title')
                .attr('x', (width + 2 * margin) / 2)
                .attr('y', margin / 4)
                .attr('text-anchor', 'middle')
                .text('Monthly Global Land-Surface Temperature')
            
            svg.append('text')
                .attr('id', 'description')
                .attr('x', (width + 2 * margin) / 2)
                .attr('y', margin / 1.2)
                .attr('text-anchor', 'middle')
                .text(`1753 - 2015: base temperature ${baseTemp}`)

            svg.append('g')
                .attr('id', 'legend')
                .selectAll('.legend')
                .data([0].concat(colorScale.quantiles()), d => d)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .append('rect')
                .attr('x', (d, i) => i * margin / 2)
                .attr('y', height + margin * 1.5)
                .attr('width', 32)
                .attr('height', (height / allMonths) * 2)
                .style('fill', (d, i) => legendColors[i]);

        });
});