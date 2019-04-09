document.addEventListener('DOMContentLoaded', () => {
    const req = new XMLHttpRequest();
    req.open(
        'GET',
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
        true
        );
        req.send();
        req.onload = () => {
            const completeData = JSON.parse(req.responseText);
            const GDPData = completeData.data;
            const svgW = 1000, svgH = 500, padding = 5;
            const xScale = d3.scaleLinear()
                             .domain([d3.min(GDPData, d => Date.parse(d[0])), d3.max(GDPData, d => Date.parse(d[0]))]).range([0, svgW - padding])
            const yScale = d3.scaleLinear()
                             .domain([0, d3.max(GDPData, d => d[1])]).range([0, svgH - padding])
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);
            console.log(completeData);
            
            const svg = d3.select('body')
            .append('svg')
            .attr('width', svgW)
            .attr('height', svgH)
            
            const title = d3.select('body')
            .append('h2')
            .attr('id', 'title')
            .text('United States GDP')

            //xAxis
            svg.append('g')
               .attr('id', 'x-axis')
               .attr('transform', `translate(0, ${svgH - 20})`)
               .call(xAxis);
            
            // Bar Chart & tooltip
            svg.selectAll('rect')
               .data(GDPData)
               .enter()
               .append('rect')
               .attr('x', (d, i) => xScale(Date.parse(d[0])))
               .attr('y', (d, i) => svgH - yScale(d[1]))
               .attr('width', svgW / GDPData.length)
               .attr('height', d => d[1])
               .attr('class', "bar")
               .attr('data-date', d => d[0])
               .attr('data-gdp', d => d[1])
               .append('title')
               .attr('id', 'tooltip')
               .attr('data-date', d => d[0])
               .text(d => `${d[0]}\n${d[1]}`)
        }
    });