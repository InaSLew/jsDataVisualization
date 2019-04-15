const urlUSEducation = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
urlUSCounties = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',
responses = [];

const getUSEducation = () => axios.get(urlUSEducation).then(res => responses.push(res));

const getUSCounty = () => axios.get(urlUSCounties).then(res => responses.push(res));

const margin = 20,
width = 1000 - margin * 2,
height = 700 - margin * 2,
formatPercent = d3.format('.1%');

const svg = d3.select('#data-viz').append('svg')
.attr('width', width + 2 * margin)
.attr('height', height + 2 * margin)
.append('g')
.attr('transform', `translate(${margin}, ${margin})`);

let tooltip = d3.select('#data-viz')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip');

const showTooltip = d => {
    tooltip.transition();
    tooltip.style('opacity', 0.8)
        .html(`${d.regionalData.area_name}(${d.regionalData.state}): ${d.regionalData.bachelorsOrHigher}%`)
        .attr('data-education', d.regionalData.bachelorsOrHigher)
        .style('left', `${d3.mouse(d3.event.currentTarget)[0] + 300}px`)
        .style('top', `${d3.mouse(d3.event.currentTarget)[1] + 150}px`)
}

const hideTooltip = d => tooltip.transition().style('opacity', 0);

const legendText = ['', '25%', '', '50%', '', '75%', '', '100%'],
legendColors = ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'];

axios.all([getUSEducation(), getUSCounty()])
.then(axios.spread((acct, perms) => {
    
    const USEducation = responses[0].data,
    USCounties = responses[1].data;
    
    const colorScale = d3.scaleQuantize()
    .domain([d3.min(USEducation, d => d.bachelorsOrHigher), d3.max(USEducation, d => d.bachelorsOrHigher)])
    .range(legendColors);
    
    const counties = topojson.feature(USCounties, USCounties.objects.counties).features;
    for(let i = 0; i < counties.length; i += 1) {
        counties[i].regionalData = USEducation[i];
    }
    
    const theMap = svg.selectAll('.county')
    .data(counties)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', d3.geoPath())
    .attr('data-fips', d => d.regionalData.fips)
    .attr('data-education', d => d.regionalData.bachelorsOrHigher)
    .attr('fill', d => colorScale(d.regionalData.bachelorsOrHigher))
    .on('mouseover', showTooltip)
    .on('mouseout', hideTooltip);
    
    const legend = svg.append('g')
        .attr('id', 'legend');
    
    const legendItems = legend.selectAll('.legendItem')
        .data(d3.range(8))
        .enter()
        .append('g')
        .attr('class', 'legendItem')
        .attr('transform', (d, i) => `translate(${ i * 31 }, ${margin})`);

    legendItems.append('rect')
        .attr('x', width - 240)
        .attr('y', -7)
        .attr('width', 30)
        .attr('height', 6)
        .attr('class', 'rect')
        .attr('fill', (d, i) => legendColors[i]);
    
    legendItems.append('text')
        .attr('x', width - 240)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .text((d, i) => legendText[i]);
    
    
}))