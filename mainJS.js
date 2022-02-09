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

              /*https://github.com/topojson/topojson-client/blob/master/README.md#feature*/
              console.log(topojson.feature(jsonCounty,jsonCounty.objects.counties).features);
       
       

       /*debug section*/
       console.log("jsonEducation");
       console.log(jsonEducation);
       console.log("jsonCountry");
       console.log(jsonCounty);

};

function scaleTheCoordinates(coordinateArray, scaleX, scaleY){
       let negNumberX = true;
       let negNumberY = true;
       let scaledNumberX;
       let scaledNumberY;
       if(coordinateArray[0]<0){
              negNumberX = false;
       }
       if(coordinateArray[1]<0){
              negNumberY = false;
       }

       scaledNumberX = negNumberX===true?scaleX(Math.abs(coordinateArray[0]))*(-1):scaleX(coordinateArray[0]);

       scaledNumberY = negNumberY===true?scaleY(Math.abs(coordinateArray[1]))*(-1):scaleY(coordinateArray[1]);

       return [scaledNumberX, scaledNumberY];
};
