/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

/*
const USEducationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const USCountyData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
*/
/*LOCAL DATA FOR DEVELOPMENT*/
const USEducationData = "./data/for_user_education.json";
const USCountyData = "./data/counties.json";

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

       /*Create projection - to project latitude and longitude coordinates on flat surface (monitor). Using standard d3 tool Mercator*/
       var projekctija = d3.geoMercator()
              /*center it*/
              .translate([chartWidth/2,chartHeight/2]);
       /*
         create a path (geoPath) using projection
       */
      var path = d3.geoPath()
              .projection(projekctija);

       svg.selectAll(".county")  
              .data(topojson.feature(jsonCounty,jsonCounty.objects.counties).features)
              .enter()
              .append("path")
              .attr("id", (d)=>{return d.id;})
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr("d", (d)=>{return generatePolyDrawingPath(d.geometry.coordinates);});

       /*https://github.com/topojson/topojson-client/blob/master/README.md#feature*/
       console.log("debug object");
       console.log(topojson.feature(jsonCounty,jsonCounty.objects.counties).features);
       
       /*debug section*/
       console.log("jsonEducation");
       console.log(jsonEducation);
       console.log("jsonCountry");
       console.log(jsonCounty);

};

function generatePolyDrawingPath(coordinateArray){

       let startCoords = "M" + coordinateArray[0][0][0] + "," + coordinateArray[0][0][1] + " ";
       let middleCoords = "";
       let endPath = "z";

       /*ignore first (starting position i=0) array and last (i=[].length since end position = starting position) array*/
       for(let i=1; i<coordinateArray[0].length; i++){
              middleCoords = middleCoords + "L" + coordinateArray[0][i][0] + ", " + coordinateArray[0][i][1] + " ";
       };
       return startCoords + middleCoords + endPath;
};
