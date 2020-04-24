let csv = 'Fire_Department_Calls_for_Service.csv';
console.log("CSV: "+csv);


d3.csv(csv).then(drawChart);
function Frequency(data){
  var numbers;
  var neighbor;
  var type;
  var unit;
  var UnitType;
  const Counting = new Object();
  Counting.names = type;
  Counting.children = [];
  console.log("length: "+data.length);
  for(var i = 0; i < data.length; i++){
    neighbor = data[i].Neighborhooods;
    unit = data[i].UnitType;
    // Counting.name = type
    if(data[i].CallTypeGroup == 'Alarm'){
      type = data[i].CallTypeGroup;
      Counting.names = type
      const list = Counting.children;
       // console.log(JSON.stringify(unit))
       // console.log("00000"+JSON.stringify(list))
      if(list.some(UnitType => UnitType.names === unit)){
        // console.log("UNIT: "+unit+": "+JSON.stringify(list))
        const result = list.find(({ names}) => names === unit);
        // console.log(JSON.stringify("RES: "+result))
        UnitType.value = UnitType.value+1;
        // result.children.push(neighbor);
        // console.log(2)
      }else{
        UnitType = new Object();
        UnitType.names = unit;
        // UnitType.children = [];
        UnitType.value = 1;
        // UnitType.children.push(neighbor);
        Counting.children.push(UnitType);
        // Counting.name = type
        // console.log(1)
      }
    }
    else{
      continue;
    }
  }
   console.log("Array: "+JSON.stringify(Counting));
  return Counting;
}

function drawChart(data){
  const Groupdata = Frequency(data);
  var root = d3.hierarchy(Groupdata);
  // console.log("Root: "+JSON.stringify(root))
  var packLayout = d3.pack()
    .size([600, 600])
    .padding(10)

  var rootNode = d3.hierarchy(Groupdata)

  rootNode.sum(function(d) {
    return d.value;
  });

  packLayout(rootNode);
  console.log("Descendants: "+ (rootNode.descendants()));
  // d3.select('svg g')
  //   .selectAll('circle')
  //   .data(rootNode.descendants())
  //   .enter()
  //   .append('circle')
  //   .attr('cx', function(d) { return d.x; })
  //   .attr('cy', function(d) { return d.y; })
  //   .attr('r', function(d) { return d.r; })
  //   .append('text')
  //   .attr('dy', 4)
  //   .text(function(d) {
  //     return d.name;
  //   })
  var nodes = d3.select('svg g')
  .selectAll('g')
  .data(rootNode.descendants())
  .enter()
  .append('g')
  .attr('transform', function(d) {return 'translate(' + [d.x, d.y] + ')'})
  nodes
  .append('circle')
  .attr('r', function(d) { return d.r; })
  nodes
  .append('text')
  .attr('dy', 4)
  .text(function(d) {
    return d.children === undefined ? d.data.names : '';
  })

}
