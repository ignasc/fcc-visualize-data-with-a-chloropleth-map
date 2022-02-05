/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

const USEducationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const USCountryData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

document.addEventListener("DOMContentLoaded", function(){

       const req = new XMLHttpRequest();
       req.open("GET",USEducationData,true);
       req.send();
       req.onload = function(){
              const jsonEducation = JSON.parse(req.responseText);

              req.open("GET",USCountryData,true);
              req.send();
              req.onload = function(){
                     const jsonCountry = JSON.parse(req.responseText);

                     main(jsonEducation, jsonCountry);

              };
       };



});

function main(jsonEducation, jsonCountry){
       
       /*Set up SVG canvas to work on*/
       const pageWidth  = document.documentElement.scrollWidth;
       const chartWidth = pageWidth<1024? 1024:Math.round(pageWidth*0.8);
       const chartHeight = 800;
       const padding = 60;

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

       

       /*debug section*/

       const tempTestScaleX = d3.scaleLinear()
              .domain([
                     d3.min(jsonCountry.arcs, (d)=>{
                            return d[0][0];
                     }),
                     d3.max(jsonCountry.arcs, (d)=>{
                            return d[0][0];
                     })
              ])
              .range([
                     padding,chartWidth - padding
              ]);

       const tempTestScaleY = d3.scaleLinear()
              .domain([
                     d3.max(jsonCountry.arcs, (d)=>{
                            return d[0][1];
                     }),
                     d3.min(jsonCountry.arcs, (d)=>{
                            return d[0][1];
                     })
              ])
              .range([
                     chartHeight - padding, padding
              ]);

       svg.selectAll("circle")
              .data(jsonCountry.arcs)
              .enter()
              .append("circle")
              .attr("id","country-circle")
              .attr("r", 2)
              .attr("cx",
                     (d)=>tempTestScaleX(d[0][0])
              )
              .attr("cy",
                     (d)=>tempTestScaleY(d[0][1])
              );

       console.log("jsonEducation");
       console.log(jsonEducation);
       console.log("jsonCountry");
       console.log(jsonCountry.arcs[0][0]);

};
