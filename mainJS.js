/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

const USEducationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const USCountyData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

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

                     /*reduced size arrays (temporary)*/
                     let counter = 100;
                     let tempJsonEducation = [];
                     let tempJsonCounty = {arcs: []};

                     for(let i = 0; i<counter; i++){
                            tempJsonEducation.push(jsonEducation[i]);

                            tempJsonCounty.arcs.push(jsonCounty.arcs[i]);
                     };
                     
                     console.log("tempJsonEducation");
                     console.log(tempJsonEducation);
                     console.log("tempJsonCountry");
                     console.log(tempJsonCounty);

                     main(tempJsonEducation, tempJsonCounty);

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

       

       /*debug section*/

       const tempTestScaleX = d3.scaleLinear()
              .domain([
                     d3.min(jsonCounty.arcs, (d)=>{
                            return d[0][0];
                     }),
                     d3.max(jsonCounty.arcs, (d)=>{
                            return d[0][0];
                     })
              ])
              .range([
                     padding,chartWidth - padding
              ]);

       const tempTestScaleY = d3.scaleLinear()
              .domain([
                     d3.max(jsonCounty.arcs, (d)=>{
                            return d[0][1];
                     }),
                     d3.min(jsonCounty.arcs, (d)=>{
                            return d[0][1];
                     })
              ])
              .range([
                     chartHeight - padding, padding
              ]);

       svg.selectAll("circle")
              .data(jsonCounty.arcs)
              .enter()
              .append("circle")
              .attr("id","country-circle")
              .attr("r", 1)
              .attr("cx",
                     (d)=>tempTestScaleX(d[0][0])
              )
              .attr("cy",
                     (d)=>tempTestScaleY(d[0][1])
              );

       svg.selectAll("path")
              .data(jsonCounty.arcs)
              .enter()
              .append("path")
              .style("stroke", "red")
              .style("fill", "none")
              .attr("d", (d)=>{
                     let startCoordinate = tempTestScaleX(d[0][0]) + " " + tempTestScaleY(d[0][1]);

                     let testArrayLOL = [];
                     let relativePoints = "";

                     d.forEach((item, index)=>{
                            if(index==0){return};
                            /*
                            patikrinti, ar skaicius neigiamas
                            jei neigiamas, nuimti minuso zenkla
                            scale the number to proper size
                            prideti minuso zenkla, jei buvo jis nuimtas
                            prideti koordinate
                            */

                            testArrayLOL.push(scaleTheCoordinates(item, tempTestScaleX, tempTestScaleY));
                     })

                     testArrayLOL.forEach((d)=>{
                            relativePoints = relativePoints + "l" + d[0] + " " + d[1] + " ";
                     })

                     /*return "M " + startCoordinate + relativePoints + "z"; */
                     return "M " + startCoordinate + "l20 0 l 0 -20" + "z";
              });

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
