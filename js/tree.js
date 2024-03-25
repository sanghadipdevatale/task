var treeData = {
  // main node 
  name: "Car-Info",
  children: [
     // 1 node in second line 
    {
      name: "Reasearch",
      children: [
        {
          name: "External",
          // child of External node line 3
          children: [
            {
              name: "B2B",
              // Child of b2b node line4
              children: [
                {
                  name: "online",
                },
                {
                  name: "Interview",
                },
                {
                  name: "Public Data",
                },
                {
                  name: "Health",
                },
                // 4 children end 
              ],
            },
            {
              name:"B2C",
            },
          ],
        },
        // end of external node 
        {
          name: "Internal",
        },
        // end of internal node 
      ],
      // endof reasearch node 
    },
    // 2 none 2 line
    {
      name: "Planning",
      children:[
        {
          name: "PRD",
        },
        {
          name: "Spacs",
        },
      ]
    },
    // end of planning node 
    // 2 line 3 node 
    {
      name: "Designing",
      children:[
        {
          name: "Hardwere",
        },
        {
          name: "Softwere",
        },
      ]
    },
    // end of dessigning node 
    // 2line 4 node 
    {
      name: "Manufacturing",
      children:[
        {
          name: "Material",
        },
        {
          name: "Production",
        },
      ]
    },
    // end of manufaturing
    // 2line 5 node 
    {
      name: "Sales marketing",
      children:[
        {
          name: "Online",
        },
        {
          name: "Dealership",
        },
      ]
    },
    // end of sales marketing



    // end of tree 
  ],
  
};

var margin = { top: 20, right: 90, bottom: 20, left: 90 };
var width = 960 - margin.left - margin.right;
var height = 1000 - margin.top - margin.bottom;

var svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0;
var duration = 750;
var root;

var treemap = d3.tree().size([height, width]);
root = d3.hierarchy(treeData, function (d) {
  return d.children;
});
root.x0 = height / 2;
root.y0 = 0;
console.log("root ", root);

update(root);

function update(source) {
  var treeData = treemap(root);

  // nodes
  var nodes = treeData.descendants();
  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });
  var node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });
  var nodeEnter = node
    .enter()
    .append("g")
    // .attr("class", "node")
    .attr("class", function(d) { return "node " + d.data.name.replace(/\s+/g, '-').toLowerCase(); }) // Assign class based on node name

    .attr("transform", function (d) {
      return "translate(" + source.y0 + ", " + source.x0 + ")";
    })
    .on("click", click);

  
  nodeEnter
  .append("rect")
  // .attr("class", "node")
  .attr("width",80)
  .attr("height", 30)
  

  .style("fill", function (d) {
    return d._children ? "red" : "#fff";
  });


  nodeEnter
    .append("text")
    .attr("dy", "0.35em") // Adjust vertical position of text
    .attr("text-anchor", "middle") // Center text horizontally
    .attr("x", 40) // Center text horizontally inside the rectangle
    .attr("y", 20) // Center text vertically inside the rectangle
    .text(function(d) { return d.data.name; }); // Set the text to display from the data

  var nodeUpdate = nodeEnter.merge(node);

  nodeUpdate
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + ", " + d.x + ")";
    });

  nodeUpdate
    .select("rect.node")
    .attr("r", 10)
    .style("fill", function (d) {
      return d._children ? "red" : "#fff";
    })
    .attr("cursor", "pointer");

  nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("rect").attr("r", 0);
  nodeExit.select("text").style("fill-opacity", 0);

  // links
  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
      C ${(s.y + d.y) / 2} ${s.x}
        ${(s.y + d.y) / 2} ${d.x}
        ${d.y} ${d.x}`;
    return path;
  }
  var links = treeData.descendants().slice(1);
  var link = svg.selectAll("path.link").data(links, function (d) {
    return d.id;
  });
  var linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y };
      return diagonal(o, o);
    });
  var linkUpdate = linkEnter.merge(link);
  linkUpdate
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      return diagonal(d, d.parent);
    });

  var linkExit = link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  function click(event, d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}
