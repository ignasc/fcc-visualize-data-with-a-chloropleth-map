/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

const USEducationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const USCountryData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

document.addEventListener("DOMContentLoaded", function(){

       const req1 = new XMLHttpRequest();
       req1.open("GET",USEducationData,true);
       req1.send();
       req1.onload = function(){
              const jsonEducation = JSON.parse(req1.responseText);
              console.log("First link loaded");
              console.log(jsonEducation);
       };
       const req2 = new XMLHttpRequest();
       req2.open("GET",USCountryData,true);
       req2.send();
       req2.onload = function(){
              const jsonCountry = JSON.parse(req2.responseText);
              console.log("Second link loaded");
              console.log(jsonCountry);
       };



});
