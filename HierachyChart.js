let csv = 'Fire_Department_Calls_for_Service.csv';
console.log("CSV: "+csv);


d3.csv(csv).then(function(data){
drawChart(data);
drawTreeMap(data);
});
function Frequency(data){
  var numbers;
  var neighbor;
  var type;
  var unit;
  var UnitType;
  var Neighborhooods;
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
        // UnitType.value = UnitType.value+1;
        // result.children.push(neighbor);
        // console.log(2)
        Neighborhooods = new Object();
        Neighborhooods.names = neighbor;
        Neighborhooods.values = 1;
        UnitType.children.push(Neighborhooods);
      }else{
        UnitType = new Object();
        UnitType.names = unit;
        UnitType.children = [];
        // UnitType.value = 1;
        Neighborhooods = new Object();
        Neighborhooods.names = neighbor;
        Neighborhooods.values = 1;
        UnitType.children.push(Neighborhooods);
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
    console.log("VALUE: "+d.values)
    return d.values;
  });

  packLayout(rootNode);
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
  // .text(function(d) {
  //   return d.children === undefined ? d.data.names : '';
  // })

}


function drawTreeMap(data){
  const Groupdata = Frequency(data);
  var treeLayout = d3.tree()
  .size([800, 400])

var root = d3.hierarchy(Groupdata)

treeLayout(root)

// Nodes
d3.select('#treemap g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 4);

// Links
d3.select('#treemap g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x;})
  .attr('y1', function(d) {return d.source.y;})
  .attr('x2', function(d) {return d.target.x;})
  .attr('y2', function(d) {return d.target.y;});
}
