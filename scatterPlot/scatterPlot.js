const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const getDateObj = (cyclistObj) => {
    let dateObj = new Date(null);
    let parsedSeconds = cyclistObj.Seconds % 60;
    let parsedMinutes = (cyclistObj.Seconds - parsedSeconds) / 60;
    dateObj.setMinutes(parsedMinutes, parsedSeconds);

    return dateObj;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
        .then(res => res.json())
        .then(dataset => {
            console.log(dataset);

            const margin = 60;
            const width = 1000 - 2 * margin;
            const height = 600 - 2 * margin;

            const svg = d3.select('#data-viz')
                .append('svg')
                .attr('width', width + 2 * margin)
                .attr('height', height + 2 * margin);
            
            const chart = svg.append('g')
                .attr('transform', `translate(${margin}, ${margin})`);

            const yScale = d3.scaleTime()
                .range([0, height])
                .domain([d3.min(dataset, d => getDateObj(d)), d3.max(dataset, d => getDateObj(d))]);
            chart.append('g')
                .attr('id', 'y-axis')
                .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')));
            
            const xScale = d3.scaleTime()
                .range([0, width])
                .domain([d3.min(dataset, d => new Date().setFullYear(d.Year)), d3.max(dataset, d => new Date().setFullYear(d.Year))]);
            chart.append('g')
                .attr('id', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(xScale).ticks(d3.timeYear));
        })
});