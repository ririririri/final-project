//choose the cutoff
var slider = document.getElementById("myRange");
var currentCutoff = document.getElementById("demo");
var cutoffValue = 5;    //initial cutoff value is 5
var qtyList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
currentCutoff.innerHTML = slider.value;
var upperList = [];
var lowerList = [];
var levelList = [];
var detailList = [];
var letterGradeList = [];
var test = [];

//pass grades from upload pages
var finalGrades = JSON.parse(localStorage.getItem('test'));

/*
var finalGrades = [
    {studentID: "asm23", quiz: "83.45", midterm: "56.7", final: "77.4", finalPercentage: "71.37"},
    {studentID: "bobbyc", quiz: "66.7", midterm: "78.22", final: "34", finalPercentage: "56.02"},
    {studentID: "hermr", quiz: "93.5", midterm: "86.5", final: "89.02", finalPercentage: "89.03"},
    {studentID: "dude32", quiz: "23.4", midterm: "12.33", final: "34.87", finalPercentage: "24.69"},
    {studentID: "jack", quiz: "45.3", midterm: "60.54", final: "54.23", finalPercentage: "54.65"}
];
*/

var gradeData = [
    {Grade:'A+',Qty:0},
    {Grade:'A',Qty:0},
    {Grade:'A-',Qty:0},
    {Grade:'B+',Qty:0},
    {Grade:'B',Qty:0},
    {Grade:'B-',Qty:0},
    {Grade:'C+',Qty:0},
    {Grade:'C',Qty:0},
    {Grade:'C-',Qty:0},
    {Grade:'D',Qty:0},
    {Grade:'F',Qty:0}
];

//change cutoff
slider.oninput = function() {
    console.log(gradeData);
    currentCutoff.innerHTML = this.value;
    cutoffValue = currentCutoff.innerHTML;  //update immediately
    //upper list: 100, 95, 90, 85
    makeChart();
    showLevel();
    showDetails();
    console.log(gradeData);
    console.log(gradeData);
}

function makeChart(){
    for(let k=0;k<11;k++) {
        upperList[k] = 100 -  k * cutoffValue;
        lowerList[k] = 100 - (k + 1) * cutoffValue;

        //loop objects to final qty of each level
        for(let i=0;i<finalGrades.length;i++) {
            if(finalGrades[i].finalPercentage > lowerList[k] && finalGrades[i].finalPercentage < upperList[k]) {
                gradeData[k].Qty++;
                letterGradeList[i] = gradeData[k].Grade;
                //qtyList[k]++;
            }
            //F situation
            if(finalGrades[i].finalPercentage < lowerList[10]) {
                gradeData[10].Qty++;
                letterGradeList[i] = gradeData[k].Grade;
                //qtyList[10]++;
            }
        }
    }

    var svg = d3.select("#svg");

    var padding = {top:20,right:30,bottom:30,left:50};

    var color = d3.hcl(-97, 32, 52);

    var chartArea = {
        "width":parseInt(svg.style("width")) - padding.left - padding.right,
        "height":parseInt(svg.style("height")) - padding.top - padding.bottom
    };

    var yScale = d3.scaleLinear()
        .domain([0,d3.max(gradeData, function(d){return d.Qty})])
        .range([chartArea.height,0]).nice();

    var xScale = d3.scaleBand()
        .domain(gradeData.map(function(d){return d.Grade}))
        .range([0,chartArea.width])
        .padding(.2);

    //xAxis
    var xAxis = svg.append("g")
        .classed("xAxis",true)
        .attr(
            'transform','translate('+padding.left+','+(chartArea.height+padding.top)+')'
        )
        .call(d3.axisBottom(xScale));

    //yAxis
    var yAxisFn = d3.axisLeft(yScale);
    var yAxis = svg.append("g")
        .classed("yAxis",true)
        .attr(
            'transform','translate('+padding.left+','+padding.top+')'
        );
    yAxisFn(yAxis);

    //bars
    var rectGrp = svg.append("g").attr(
        'transform','translate('+padding.left+','+padding.top+')'
    );

    //rectGrp.exit.remove()

    rectGrp.selectAll("rect").data(gradeData).enter()
        .append("rect")
        .attr("width",xScale.bandwidth())
        .attr("height",function(d){
            return chartArea.height-yScale(d.Qty);
        })
        .attr("x",function(d){
            return xScale(d.Grade);
        })
        .attr("y",function(d){
            return yScale(d.Qty);
        })
        
        .attr("fill",function(d){
            return color;
        });  
}

function showLevel() {
    for(let n=0;n<10;n++) {
        levelList[n] = gradeData[n].Grade + ": " +lowerList[n] + " - " + upperList[n];
    }
    levelList[10] = gradeData[10].Grade + ": " + "Under " + upperList[10];
    document.getElementById("level").innerHTML = levelList;
}

function showDetails() {
    for(let a=0;a<finalGrades.length;a++) {
        detailList[a] = "#" + finalGrades[a].studentID + ": Quiz: " + finalGrades[a].quiz + ", Midterm: " + finalGrades[a].midterm
                        + ", Final: " + finalGrades[a].final + ", Final Percentage: " + finalGrades[a].finalPercentage + ", Letter Grade: " + letterGradeList[a];
    }
    document.getElementById("detail").innerHTML = detailList;
}


