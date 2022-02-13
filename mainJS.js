/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

/*
const USEducationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const USCountyData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
*/
/*LOCAL DATA FOR DEVELOPMENT*/
const USEducationData = "./data/for_user_education.json";
const USCountyData = "./data/counties.json";
       
/*Set up SVG canvas to work on*/
const pageWidth  = document.documentElement.scrollWidth;
const chartWidth = 1024;
const chartHeight = 800;
const padding = 60;

document.addEventListener("DOMContentLoaded", function(){

       const req = new XMLHttpRequest();
       req.open("GET",USEducationData,true);
       req.send();
       req.onload = function(){
              const jsonEducation = JSON.parse(req.responseText);

              req.open("GET",USCountyData,true);
              req.send();
              req.onload = function(){
                     const jsonCounty = JSON.parse(req.responseText);

                     main(jsonEducation, jsonCounty);

              };
       };
});

function main(jsonEducation, jsonCounty){

       /*
       Data to use. topojson.feature creates a topojson object
       */
       var topojsonObject = topojson.feature(jsonCounty,jsonCounty.objects.counties);
       const countiesDataset = topojsonObject.features;

       const svg = d3.select("#choropleth-map");

       svg.attr("width", chartWidth)
              .attr("height", chartHeight)
              /*center svg element*/
              .style("margin-left", (d)=>{
                     if(pageWidth - chartWidth <=0) {
                            return 0 + "px";
                     };
                     return (pageWidth - chartWidth)/2 + "px";
              })
              .style("margin-top", "20px");
       /*
         using d.geoPath to generate "d" values for path elements. This will generate counties for the map.
       */
      var path = d3.geoPath();

      /*Create a <g> element to store the map in it*/
      svg.append("g")
              .attr("id", "map-container")
              .attr("transform","translate(0 " + 
              padding + ")"
              );

       /*Generate US map with counties*/
       svg.select("#map-container").selectAll(".county")  
              .data(countiesDataset)
              .enter()
              .append("path")
              .attr("id", (d)=>{return d.id;})
              .attr("class", "county")
              .attr("fips", (d,index)=>jsonEducation[index].fips)
              .attr("state", (d,index)=>jsonEducation[index].state)
              .attr("area-name", (d,index)=>jsonEducation[index].area_name)
              .attr("d", (d)=>{
                     return path(d);
              });

       /*Add chart title*/
       svg.append("text")
              .text("Title goes here")
              .attr("x", chartWidth/2)
              .attr("y", padding)
              .attr("id", "title")
              .attr("text-anchor", "middle");

       /*https://github.com/topojson/topojson-client/blob/master/README.md#feature*/
       console.log("debug object");
       console.log(countiesDataset);
       
       /*debug section*/
       
       console.log("jsonEducation");
       console.log(jsonEducation);
       console.log("jsonCountry");
       console.log(jsonCounty);

};
