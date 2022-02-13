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

       /*Main canvas for the map*/
       const svg = d3.select("#choropleth-map");

       /*Tooltips for each county*/
       const toolTip = d3.select("body")
              .append("div")
              .attr("id", "tooltip")
              .style("opacity", 0);

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
              .attr("data-fips", (d,index)=>jsonEducation[index].fips)
              .attr("state", (d,index)=>jsonEducation[index].state)
              .attr("area-name", (d,index)=>jsonEducation[index].area_name)
              .attr("data-education", (d,index)=>jsonEducation[index].bachelorsOrHigher + "%")
              .attr("d", (d)=>{
                     return path(d);
              })
              .on("mouseover", (pelesEvent)=>{
                     toolTip
                     .transition()
                     .duration(100)
                     .style("opacity", 0.9);

                     toolTip
                     .html(
                            pelesEvent.target.attributes.getNamedItem("area-name").nodeValue +

                            " ,(" +

                            pelesEvent.target.attributes.getNamedItem("state").nodeValue +

                            ")</br>" +

                            "Bachelors or Higher: " +

                            pelesEvent.target.attributes.getNamedItem("data-education").nodeValue +

                            "</br>" +

                            "Fips: " +

                            pelesEvent.target.attributes.getNamedItem("data-fips").nodeValue
                     )
                     .style("position", "fixed")
                     .style("background-color", "white")
                     .style("width", "25ch")
                     .style("border-radius", "5px")
                     .style("box-shadow", "0px 5px 10px rgba(44, 72, 173, 0.5)")
                     /*tooltip positioning by getting data from mouseover event target*/
                     .style("margin-left", pelesEvent.layerX + "px")
                     .style("Top",  (pelesEvent.layerY-80) + "px")

                     .attr("data-state", "state")
                     .attr("data-stateShort", "short state")
                     .attr("data-fips", "fips");
              })
              .on("mouseout", ()=>{
                     toolTip
                     .transition()
                     .duration(100)
                     .style("opacity", 0);
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
