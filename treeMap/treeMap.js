const urlVideoGameSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

const margin = 20,
      width = 1000 - 2 * margin,
      height = 600 - 2 * margin;

const svg = d3.select('#data-viz')
.append('svg')
.attr('width', width + 2 * margin)
.attr('height', width + 2 * margin)
.append('g')
.attr('transform', `translate(${margin}, ${margin})`);

const colorScale = d3.scaleOrdinal()
    .range(d3.schemeSet3);

let tooltip = d3.select('#data-viz')
.append('div')
.attr('id', 'tooltip')
.attr('class', 'tooltip');

const showTooltip = d => {
    tooltip.transition();
    tooltip.style('opacity', 0.8)
    .html(`Name: ${d.data.name}<br >Platform: ${d.data.category}<br>Value: ${d.data.value}`)
    .attr('data-value', d.data.value)
    .style('left', `${d3.mouse(d3.event.currentTarget)[0] + 300}px`)
    .style('top', `${d3.mouse(d3.event.currentTarget)[1] + 150}px`)
}

const hideTooltip = d => tooltip.transition().style('opacity', 0);

fetch(urlVideoGameSales)
    .then(res => res.json())
    .then(dataset => {

        const root = d3.hierarchy(dataset)
            .sum(d => d.value);

        d3.treemap()
            .size([width, height])
            .padding(2)
            (root)

        svg.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('class', 'tile')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .style('stroke', 'black')
        .style('fill', d => colorScale(d.parent.data.name))
        .on('mouseover', showTooltip)
        .on('mouseleave', hideTooltip);

        svg.selectAll('text')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 20)
            .text(d => d.data.name)
            .attr('font-size', '9px');

        const categories = root.leaves()
            .map(nodes => nodes.data.category)
            .filter((category, index, self) => self.indexOf(category) === index);

        const legend = d3.select('svg')
            .append('g')
            .attr('id', 'legend');
        
        const legendItems = legend.selectAll('.legendItem')
            .data(categories)
            .enter()
            .append('g')
            .attr('class', 'legendItem')
            .attr('transform', (d, i) => `translate(${ i * 31 }, ${height + 2 * margin})`);

            legendItems.append('rect')
            .attr('x', (d, i) => margin + i * 15)
            .attr('y', (d, i) => 20)
            .attr('width', 50)
            .attr('height', 20)
            .attr('class', 'legend-item')
            .attr('fill', (d, i) => colorScale(categories[i]));
        
        legendItems.append('text')
            .attr('x', (d, i) => margin * 2 + i * 15)
            .attr('y', 10)
            .style('text-anchor', 'middle')
            .text((d, i) => categories[i]);
        
    });