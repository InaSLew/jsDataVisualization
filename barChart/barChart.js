/**
* Todos
* DONE! Display bar chart with date on the x-axis and GDP y-axis
* [ ] Add scale
* [ ] Add x-axis
* [ ] Add y-axis
*/

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
            const svgW = 500, svgH = 600;
            const scale = d3.scaleLinear()
            console.log(completeData);
            
            const svg = d3.select('body')
            .append('svg')
            .attr('width', svgW)
            .attr('height', svgH)
            
            const title = d3.select('body')
            .append('h2')
            .attr("id", "title")
            .text("GDP Bar Chart")
            
            // Bar Chart & tooltip
            svg.selectAll('rect')
               .data(GDPData)
               .enter()
               .append('rect')
               .attr("x", (d, i) => i * 30)
               .attr("y", (d, i) => svgH - d[1])
               .attr("width", 25)
               .attr("height", d => d[1])
               .attr("class", "bar")
               .attr("data-date", d => d[0])
               .attr("data-gdp", d => d[1])
            
            // Label
            // svg.selectAll('text')
            //    .data(GDPData)
            //    .enter()
            //    .append('text')
            //    .attr('x', (d, i) => i * 30)
            //    .attr('y', (d, i) => svgH - d[1] + 3)
            //    .text(d => d[0])
        }
    });