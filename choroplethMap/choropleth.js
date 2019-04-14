const urlUSEducation = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
      urlUSCounty = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',
      responses = [];

const getUSEducation = () => axios.get(urlUSEducation).then(res => responses.push(res));

const getUSCounty = () => axios.get(urlUSCounty).then(res => responses.push(res));

document.addEventListener('DOMContentLoaded', () => {
     axios.all([getUSEducation(), getUSCounty()])
        .then(axios.spread((acct, perms) => {
            console.log(responses);
        }))
});