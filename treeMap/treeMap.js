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
    .range(d3.schemeCategory10);

// let tooltip = d3.select('#data-viz')
// .append('div')
// .attr('id', 'tooltip')
// .attr('class', 'tooltip');

// const showTooltip = d => {
//     tooltip.transition();
//     tooltip.style('opacity', 0.8)
//     .html(`${d.regionalData.area_name}(${d.regionalData.state}): ${d.regionalData.bachelorsOrHigher}%`)
//     .attr('data-education', d.regionalData.bachelorsOrHigher)
//     .style('left', `${d3.mouse(d3.event.currentTarget)[0] + 300}px`)
//     .style('top', `${d3.mouse(d3.event.currentTarget)[1] + 150}px`)
// }

// const hideTooltip = d => tooltip.transition().style('opacity', 0);

/**
* dataset.children[i].name gives game console
* dataset.children[i].children[i].name gives game name
* dataset.children[i].children[i].value gives sales value (string)
*/

fetch(urlVideoGameSales)
    .then(res => res.json())
    .then(dataset => {
        console.log(dataset);

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
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style('stroke', 'black')
        .style('fill', d => colorScale(d.parent.data.name))

        svg.selectAll('text')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 20)
            .text(d => d.data.name)
            .attr('font-size', '15px');
    });