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

axios.all([getUSEducation(), getUSCounty()])
.then(axios.spread((acct, perms) => {
    
    const USEducation = responses[0].data,
          USCounties = responses[1].data;
    
    console.log(USEducation);
    console.log(USCounties);
    
    const counties = topojson.feature(USCounties, USCounties.objects.counties).features;
    console.log(counties);
    
    svg.selectAll('.county')
    .data(counties)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', d3.geoPath());
    
    // Placeholder for tooltip
    
    // const legendText = ['', '25%', '', '50%', '', '75%', '', '100%'],
    //       legendColors = ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'];
    
    // const colorScale = d3.scaleQuantize()
    //     .domain([25, 37.5, 50, 62.5, 75, 87.5, 100])
    //     .range(legendColors);
}))