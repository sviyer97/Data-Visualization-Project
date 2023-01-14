function _1(md){return(
md`# Visualizing Expander Codes`
)}

function _2(md){return(
md`
### In this project we try to visulize the ***Expander Codes***. 
(Some nice introduction of Expander Codes can be found here:
https://homes.cs.washington.edu/~anuprao/pubs/codingtheory/lecture5.pdf
https://courses.cs.washington.edu/courses/cse533/06au/lecnotes/lecture13.pdf )

### Here's how you can play with it:


**[Choose an encoding graph]** In the code block, users can choose from 5 types of codes under the get_code() function. We will be adding a drop-down menu for this later. 

**[Toggle the original message]** The top line of circles represent the original message in 0s and 1s. Users can click on these circles to toggle the values. When you are done toggling and ready to go to next step, this will be your original message.

**[Encoding]** Click the Encoding button at the bottom left to encode the message. Based on the graph, your message will be encoded to some extra bits, which are represented by the bottom line of circles. 

**[Corruption]** After the encoding process, you will see all circles merged into one line. You can click on these circles to toggle the bits. This process is to simulate the corruption of the original message.

**[Decoding]** Once you are done with the corruption, you may click on the Decoding button. The algorithm will try to restore the original message. Note that if there are too much corruption, the algorithm may fail to restore.

**[Show/Hide Original Message]** You may click on the button on the bottom right corner at any stage to show or hide the original message, which was saved after the initial toggling.`
)}

function _3(md){return(
md`
## Guidance`
)}

function _gen_vis_guid(d3,get_duplication_code,message_adjacencies,redundancy_adjacencies,top_index_to_x,top_circ_id,top_text_id,bottom_index_to_x,bottom_circ_id,bottom_text_id,edge_id)
{
  const width = 1200;
  const height = 600;

  const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width+10, height+10]);

  const radius = 15;
  const copy_msg_y = 50;  // verticle position of the reserved original messages (top layer)
  const msg_y = 100; // verticle position of the message circles (top layer)
  const red_y = 500; // verticle position of the message circles (bottom layer)
  const corruption_y = 300;
  
  const msg_g = svg.append('g'); // group of circles for message bits
  const copy_msg_g = svg.append('g');
  const red_g = svg.append('g'); // group of circles for redundancy bits
  const edge_g = svg.append('g'); // group for edges across
  const gbut_g = svg.append('g'); // group for graph buttons

  var msg_len = 3; // some codes take this as input while others don't
  var red_len = 3; // some codes take this as input while others don't
  var num_times = 3; // just for duplication code
  
  var res = get_duplication_code(msg_len, num_times);
  const bracket_msg = res[0];
  const bracket_red = res[1];
  const edge_list = res[2];

  // Start off by initializing necessary data structures such as the list of message bits.
  var msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
  var red_bits = bracket_red.map(function(d) {return ""}); // uncorrupted redundancy bits

  msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
  red_len = bracket_red.length; // depending on the code selected this might change red_len

  var msg_adj = message_adjacencies(edge_list,msg_len);
  var red_adj = redundancy_adjacencies(edge_list,red_len);

  // Add transparent instructions
  const ins_g = svg.append('g');
  var msg_ins = ins_g.append("text")
        .attr("id", "corruption_inst_txt")
        .attr("x", width-250)
        .attr("y", msg_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "21px")
        .style("opacity", 0)
        .text("Top vertices represent message bits");

  var red_ins = ins_g.append("text")
        .attr("id", "corruption_inst_txt")
        .attr("x", width/2-100)
        .attr("y", red_y + 70)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "21px")
        .style("opacity", 0)
        .text("Bottom vertices represent redundancy bits");

  var edg_ins = ins_g.append("text")
        .attr("id", "corruption_inst_txt")
        .attr("x", width/2 + 400)
        .attr("y", (red_y + msg_y)/2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "21px")
        .style("opacity", 0)
        .text("Edges represent neighborhood relationships");
  
  const intro_g = svg.append('g');
  var title = intro_g.append("text")
        .attr("x", width/2)
        .attr("y", height/2-200)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "50px")
        .text("Visualizing Expander C0des");

  intro_g.append('svg:text')
    .attr('x', width/2)
    .attr('y', height/2-50)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "30px")
    .text("Chien-Yu Lin")
    .append('svg:tspan')
    .attr('x', width/2)
    .attr('dy', 50)
    .text("Kuikui Liu")
    .append('svg:tspan')
    .attr('x', width/2)
    .attr('dy', 50)
    .text("Siddharth Iyer")
    .append('svg:tspan')
    .attr('x', width/2)
    .attr('dy', 50)
    .text("Shuting Zhai")
    .append('svg:tspan')
    .attr('x', width/2)
    .attr('dy', 150)
    .style("font-size", "25px")
    .text("Project URL: https://observablehq.com/@liukui17/expander-codes")
  
  
  svg.on("click", function() {
    intro_g.remove();
    make_message_bits_visualization(msg_g) ;

    svg.on("click", function() {
      msg_ins.style("opacity",1)
      
      svg.on("click", function () {
        make_redundancy_bits_visualization(red_g) 
        
        svg.on("click", function () {
          red_ins.style("opacity",1)
          
          svg.on("click", function() {
            make_edge_visualization(edge_g)
  
            svg.on("click", function() {
              edg_ins.style("opacity",1)
  
              svg.on("click", function(msg_g) {
                ins_g.selectAll("*").remove()
                
                svg.on("click", null);
              })
            })
          })          
        })
      })
    })
  })
  
  // msg bits with no instructions
  function make_message_bits_visualization(msg_g) {
    
    // Add circles at the top for message bits
    var msg_circs = msg_g.selectAll("circle")
    .data(bracket_msg, d => d.i)
    .enter()
    .append("circle")
      .attr("cx", d => top_index_to_x(d,msg_len))
      .attr("cy", msg_y)
      .attr("r", radius)
      .attr("fill", "white")
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr("id", d => top_circ_id(d));
      //.on("click", function(d) {
      //  precorruption_toggle_message_bits(d)
      // });

    // Add text for the top message bits
    var msg_text = msg_g.selectAll("text")
       .data(bracket_msg.map(d => [d, msg_bits[d]]))
       .join("text")
         .attr("x", d => top_index_to_x(d[0],msg_len))
         .attr("y", msg_y)
         .attr("id", d => top_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1]);
         // .on("click", function(d) {
         //   precorruption_toggle_message_bits(d)
         // });
  }

  // red bits 
  function make_redundancy_bits_visualization(red_g) {
    
    // Add circles at the bottom for redundancy bits
    var red_circs = red_g.selectAll("circle")
        .data(bracket_red)
        .enter()
        .append("circle")
          .attr("cx", d => bottom_index_to_x(d,red_len))
          .attr("cy", red_y)
          .attr("r", radius)
          .attr("fill", "white")
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr("id", d => bottom_circ_id(d));

    // Add text for the bottom redundancy bits
    var red_text = red_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0],red_len))
         .attr("y", red_y)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1]);
  }
  

  function make_edge_visualization(edge_g) {
    // add edges
    var edges = edge_g.selectAll("line")
      .data(edge_list)
      .enter()
      .append("line")
          .attr("x1", d => top_index_to_x(d[0],msg_len))
          .attr("y1", msg_y + radius)
          .attr("x2", d => bottom_index_to_x(d[1],red_len))
          .attr("y2", red_y - radius)
          .attr("id", edge_id)
          .attr('stroke-width', 2)
          .style("stroke", "black")
          .style("stroke-opacity",1);
  }
  
  return svg.node();
}


function _5(md){return(
md`
---
## Bipartite_2`
)}

function _bipartite_graph_2(get_duplication_code,get_vote,majority,message_adjacencies,redundancy_adjacencies,top_text_id,d3,textcirc_id_to_idx,top_circ_id,bottom_text_id,bottom_circ_id,top_index_to_x,bottom_index_to_x,edge_id,mkTriangle,redtovote_edge_id,vote_box_id,vote_text_id,get_grouped_parity_check_code,get_complete_code,get_fano_code,xor_neighbors)
{
  /* #################### DEFINES GRAPHS/CODES #################### */
  // NOTE: Only leave one type of code uncommented!
  // Design Decision: We only need to know the number of message bits and codeword bits. Each message bit will be just an index in {0,...,num_msg_bits - 1}, with ids "t0", "t1", etc. ("t" stands for "top"). Similarly, each redundancy bit will be an index in {0,...,num_red_bits - 1}, with ids "b0", "b1", etc. ("b" stands for "bottom").

  var msg_len = 3; // some codes take this as input while others don't
  var red_len = 3; // some codes take this as input while others don't
  var default_red_len = 3;
  var num_times = 4; // just for duplication code
  var copy_msg_opacity = 0;
  var sel_graph_id = 0;

  var cur_edge = null;
  var startid = null;
  var custom_mode = false;
  
  var res = get_duplication_code(msg_len, num_times);  
  
  const bracket_msg = res[0];
  const bracket_red = res[1];
  const edge_list = res[2];
  msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
  red_len = bracket_red.length; // depending on the code selected this might change red_len
  
  /* #################### DEFINES OTHER CONSTANTS AND HELPER FUNCTIONS #################### */
  const width = 1600;
  const height = 600;
  
  const radius = 15;
  const copy_msg_y = 50;
  const msg_y = 150; // verticle position of the message circles (top layer)
  const red_y = height - 200; // verticle position of the message circles (bottom layer)
  const corruption_y = 300;

  const button_width = 180;
  const button_height = 25;
  const start_button_height = 50;
  const button_x = 10;
  const button_y = height - 50;
  const show_but_x = width - 210;
  const show_but_width = 200;
  const vote_y = red_y;
  const decode_red_y = height - 100;

  function majority_decoding(msg_adj, red_adj, corrupted_msg, corrupted_red) {
    var cur_msg = corrupted_msg.slice();
    var cur_red = corrupted_red.slice();
    var transcript = [];
    var allgood = false;
    var iterct = 0;
    const iterlim = 1000;
    while ((!allgood) && iterct < iterlim) {
      allgood = true;
      for (var i = 0; i < msg_len; i++) {
        var msg_i_neighbors = msg_adj[i];
        var votes = new Array(msg_i_neighbors.length);
        for (var j = 0; j < msg_i_neighbors.length; j++) {
          votes[j] = get_vote(i, msg_i_neighbors[j], red_adj, cur_msg, cur_red);
        }
        var maj_vote = majority(votes);
        transcript.push([i, votes]);
        if (maj_vote != cur_msg[i]) {
          allgood = false;
        }
        cur_msg[i] = maj_vote;
      }
      iterct += 1;
    }
    if (transcript.length > msg_len && allgood) {
      for (var j = 0; j < msg_len; j++) {
        transcript.pop();
      }
    }
    transcript.push(allgood);
    return transcript;
  }

  /* #################### BUILDS THE ACTUAL VISUALIZATION #################### */

  // Start off by initializing necessary data structures such as the list of message bits.
  var msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
  var red_bits = bracket_red.map(function(d) {return "⊕"}); // uncorrupted redundancy bits

  var msg_adj = message_adjacencies(edge_list,msg_len);
  var red_adj = redundancy_adjacencies(edge_list,red_len);

  // Implements toggling for the bits in the precorruption stage.
  function precorruption_toggle_message_bits(d) {
    // var id = d3.select(this).attr("id");
    var id = d.srcElement.id;
    var idx = parseInt(id.slice(1, id.length - 3)); // shave off the first character which is "b" or "t", and the last four character "text" or "circ"
    var ismsg = (id[0] == "t");

    if (ismsg) {
      msg_bits[idx] = msg_bits[idx] ^ 1;
      msg_g.select("#" + top_text_id(idx))
           .transition()
           .text(msg_bits[idx]);
    }
  }

  // Implements toggling for the bits in the corruption stage.
  function corruption_toggle_message_bits() {
    var id = d3.select(this).attr("id");
    var idx = textcirc_id_to_idx(id);
    var ismsg = (id[0] == "t");

    if (ismsg) {
      var cur_t = msg_g.select("#" + top_text_id(idx));
      var curbit = parseInt(cur_t.text());
      cur_t.transition()
           .text(curbit ^ 1);
      if (curbit ^ 1 != msg_bits[idx]) {
        msg_g.select("#" + top_circ_id(idx))  
          .transition()
          .style("fill", "salmon");
      } else {
        msg_g.select("#" + top_circ_id(idx))
          .transition()
          .style("fill", "white");
      }
    } else {
      var cur_t = red_g.select("#" + bottom_text_id(idx));
      var curbit = parseInt(cur_t.text());
      cur_t.transition()
        .text(curbit ^ 1);
      if (curbit ^ 1 != red_bits[idx]) {
        red_g.select("#" + bottom_circ_id(idx))
          .transition()
          .style("fill", "salmon");
      } else {
        red_g.select("#" + bottom_circ_id(idx))
          .transition()
          .style("fill", "white");
      }
    }
  }
  
  function gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g) {
    msg_g.selectAll("*").remove();
    red_g.selectAll("*").remove();
    edge_g.selectAll("*").remove();
    arrow_g.selectAll("*").remove();
    text_g.selectAll("*").remove();
    button_g.select("#default_button_rect").remove();
    button_g.select("#default_button_text").remove();
    vote_g.selectAll("*").remove();
    belief_red_edges_g.selectAll("*").remove();
    redtovote_arrow_g.selectAll("*").remove();
    
    const bracket_msg = res[0];
    const bracket_red = res[1];
    const edge_list = res[2];
    
    msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
    red_len = bracket_red.length; // depending on the code selected this might change red_len

    msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
    red_bits = bracket_red.map(function(d) {return ""}); // uncorrupted redundancy bits
    
    msg_adj = message_adjacencies(edge_list, msg_len);
    red_adj = redundancy_adjacencies(edge_list, red_len);
  
    // Add circles at the top for message bits
    var msg_circs = msg_g.selectAll("circle")
        .data(bracket_msg, d => d.i)
        .enter()
        .append("circle")
          .attr("cx", d => top_index_to_x(d, msg_len, width))
          .attr("cy", msg_y)
          .attr("r", radius)
          .style("fill", "white")
          .style('stroke', 'black')
          .style('stroke-width', 2)
          .attr("id", d => top_circ_id(d))
          .on("click", function(d) {
            precorruption_toggle_message_bits(d)
          });

    // Add text for the top message bits
    var msg_text = msg_g.selectAll("text")
       .data(bracket_msg.map(d => [d, msg_bits[d]]))
       .join("text")
         .attr("x", d => top_index_to_x(d[0], msg_len, width))
         .attr("y", msg_y)
         .attr("id", d => top_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1])
         .on("click", function(d) {
           precorruption_toggle_message_bits(d)
         });

    // Add labels for msg bits
    var msg_lab = msglab_g.selectAll("text")
       .data(bracket_msg.map(d => [d, msg_bits[d]]))
       .join("text")
         .attr("x", d => top_index_to_x(d[0], msg_len, width))
         .attr("y", msg_y-40)
         .attr("id", d => top_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .style("font-size", "28px")
         .text(d => "m" + d[0]);
    
    // Add circles at the bottom for redundancy bits
    var red_circs = red_g.selectAll("circle")
        .data(bracket_red)
        .enter()
        .append("circle")
          .attr("cx", d => bottom_index_to_x(d, red_len, width))
          .attr("cy", red_y)
          .attr("r", radius)
          .style("fill", "white")
          .style('stroke', 'black')
          .style('stroke-width', 2)
          .attr("id", d => bottom_circ_id(d));

    // Add text for the bottom redundancy bits
    var red_text = red_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0], red_len, width))
         .attr("y", red_y)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1]);

    // Add labels for redundancy bits
    var red_lab = redlab_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0], red_len, width))
         .attr("y", red_y+40)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .style("font-size", "28px")
         .text(d => "r" + d[0]);

    // Add edges
    var edges = edge_g.selectAll("line")
      .data(edge_list)
      .enter()
      .append("line")
          .attr("x1", d => top_index_to_x(d[0], msg_len, width))
          .attr("y1", msg_y + radius)
          .attr("x2", d => bottom_index_to_x(d[1], red_len, width))
          .attr("y2", red_y - radius)
          .attr("id", edge_id)
          .style('stroke-width', 2)
          .style("stroke", "black")
          .style("stroke-opacity",1);

    var edge_arrows = arrow_g.selectAll("path")
      .data(edge_list)
      .enter()
      .append("path")
          .attr("d", d => mkTriangle(top_index_to_x(d[0], msg_len, width), msg_y + radius,bottom_index_to_x(d[1],red_len,width),red_y - radius,"start","down"))
          .attr("id", edge_id)
          .style("stroke", "none")
          .style("fill","none")
          .style("stroke-width",2);

    var redtovote_arrows = redtovote_arrow_g.selectAll("path")
      .data(bracket_red)
      .enter()
      .append("path")
          .attr("d", function(d) {
                return mkTriangle(bottom_index_to_x(d, red_len, width),decode_red_y - 2*radius,bottom_index_to_x(d,red_len,width),red_y + radius,"start","down");
          })
          .attr("id", redtovote_edge_id)
          .style("stroke", "none")
          .style("fill","none")
          .style("stroke-width",2);

    // Add boxes at the bottom for redundancy bits
    var vote_circs = vote_g.selectAll("circle")
      .data(bracket_red)
      .enter()
      .append("circle")
      .attr("cx", d => bottom_index_to_x(d, red_len, width))
      .attr("cy", vote_y)
   //   .attr("width", 2 * radius)
   //   .attr("height", 2 * radius)
      .attr("r", radius)
      .style("fill", "none")
      .style('stroke', 'none')
      .style('stroke-width', 2)
      .style("stroke-opacity", 0)
      .attr("id", d => vote_box_id(d));
  
    // Add circles at the bottom for redundancy bits
    var vote_text = vote_g.selectAll("text")
         .data(bracket_red)
         .join("text")
           .attr("x", d => bottom_index_to_x(d, red_len, width))
           .attr("y", vote_y)
           .attr("id", d => vote_text_id(d))
           .attr("text-anchor", "middle")
           .attr("alignment-baseline", "middle")
           .text("");

    // Add labels for belief circles 
    bellab_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0], red_len, width)- 40)
         .attr("y", red_y)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .style("font-size", "28px")
         .text("");
    
    var belief_red_edges = belief_red_edges_g.selectAll("line")
        .data(bracket_red)
        .enter()
        .append("line")
        .attr("x1", d => bottom_index_to_x(d, red_len, width))
        .attr("x2", d => bottom_index_to_x(d, red_len, width))
        .attr("y1", d => red_y + radius)
        .attr("y2", d=> decode_red_y - radius)
        .style("stroke", "black")
        .style("stroke-width",2)
        .style("stroke-opacity", 0);

    // TODO Add customization
/*    msg_g.selectAll("circle").on("mousedown", mousedown);
    red_g.selectAll("circle").on("mousedown", mousedown);
    edge_g.selectAll("line").on("click", deleteLine); */
    
  }
  
  // Start building actual visualization...
  const extra_width = 300;
  const extra_height = 0;
  const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width+extra_width, height+ extra_height]);

  const msg_g = svg.append('g'); // group of circles for message bits
  //const copy_msg_g = svg.append('g');
  const red_g = svg.append('g'); // group of circles for redundancy bits
  const edge_g = svg.append('g'); // group for edges across
  const gbut_g = svg.append('g'); // group for graph buttons
  const arrow_g = svg.append('g'); //group for arrows
  const text_g = svg.append('g'); // group for guidance text
  const vote_g = svg.append('g'); // group for vote bits
  const belief_red_edges_g = svg.append('g'); //group for edges from belief bits to redundant bits
  const redtovote_arrow_g = svg.append('g'); // group for edges between vote bits and redundancy bits

  const text_g1 = svg.append('g'); // group for explanation function MAJ(...)
  const text_g2 = svg.append('g'); // group for belief calculation texts
  
  const button_g = svg.append('g');
  const corr_g = svg.append('g');
  const show_but_g = svg.append('g');

  const msglab_g = svg.append('g'); //group for msg labels
  const redlab_g = svg.append('g'); //group for red labels
  const bellab_g = svg.append('g'); //group for belief labels

/*  var debug = svg.append('text')
              .attr('x', 0)
              .attr('y', 15)
              .attr("dy", ".40em");
              //.text("Use .text() to print debug info here! TODO: remove in final version"); */

  function guidance_animation(delay, dur_1) {
    msg_g.selectAll("circle")
         .transition()
         .delay(delay)
         .style('stroke-width', 3)
         .style('stroke', 'red')
         .transition()
         .delay(dur_1*2)
         .style('stroke', 'black')
         .style('stroke-width', 2)

    msglab_g.selectAll("text")
            .transition()
            .delay(delay)
            .style('fill', 'red')
            .transition()
            .delay(dur_1)
            .style('fill', 'black')
    
    text_g.append('text')
          .attr('x', width/2)
          .attr('y', msg_y - 80)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill", "red")
          .transition()
          .delay(delay)
          .text("Top vertices are the message bits you want to send to your friend.")
          .transition()
          .delay(dur_1)
          .text("Click them to toggle the bits!")
          .transition()
          .delay(dur_1)
          .remove();

    red_g.selectAll("circle")
         .transition()
         .delay((dur_1 + delay)*2 + delay)
         .style('stroke-width', 3)
         .style('stroke', 'blue')
         .transition()
         .delay(dur_1)
         .style('stroke', 'black')
         .style('stroke-width', 2)

    redlab_g.selectAll("text")
            .transition()
            .delay((delay + dur_1)*2 + delay)
            .style('fill', 'blue')
            .transition()
            .delay(dur_1)
            .style('fill', 'black')

    edge_g.selectAll("line")
          .transition()
          .delay((delay + dur_1)*3 + delay)
          .style("stroke", "violet")
          .style('stroke-width', 3)
          .transition()
          .delay(dur_1)
          .style("stroke", "black")
          .style('stroke-width', 2)
    
    text_g.append('text')
          .attr('x', width/2)
          .attr('y', red_y + 90)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill", "blue")
          .transition()
          .delay((delay + dur_1)*2 + delay)
          .text("Bottom vertices are the redundant bits added to protect the message bits.")
          .transition()
          .delay(dur_1)
          .duration(delay)
          .style("fill", "violet")
          .text("")
          .transition()
          .text("The value of a redundants bit is the XOR of the connected message bits.")
          .transition()
          .delay(dur_1)
          .duration(delay)
          .style("fill", "limegreen")
          .text("")
          .transition()
          .text("You can choose different structures by clicking the buttons on the top.")
          .on("end", gen_graph_button)
          .transition()
          .delay(dur_1)
          .duration(delay)
          .style("fill", "black")
          .text("")
          .transition()
          .text("Let's start learning by clicking the message bits and press the encode button!")
          .on("end", gen_encode_button)
          .transition()
          .delay(dur_1)
          .remove();
  }
  
  function gen_encode_button() {
    button_g.select("#buttonrect").remove();
    button_g.select("#buttontext").remove();
    
    button_g.append('rect')
            .attr('x', width - button_width)
            .attr('y', 0)
            .attr('width', button_width)
            .attr('height', button_height)
            .style('stroke', 'black')
            .style('stroke-width', 3)
            .style('fill', 'white')
            .attr("id", "buttonrect")
            .on('click', encode_animation);
    
    button_g.append('text')
            .attr('x', width - (button_width / 2))
            .attr('y', button_height / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("id", "buttontext")
            .text("Click here to encode!")
            .on('click', encode_animation);
  }
  
  function gen_graph_button() {
    const graph_y = 0;
    gbut_g.selectAll('rect')
        .data(graphs, (d,i) => i)
        .enter()
        .append('rect')
      //    .attr('x', width + extra_width - 50)
      //    .attr('y', (d,i) => (i-2)*60 + height/2)
          .attr('x', (d,i) => i * button_width)
          .attr('y', graph_y)
          .attr('width', button_width)
          .attr('height', button_height)
          .attr('stroke', 'black')
          .attr('stroke-width', 3)
          .attr('fill', function(d, i){
            return (i > 0) ? 'white':'lightgreen';
          })
          .attr('id', (d, i) => "gbut"+i+"rect")
          .on('click', function(d){change_graph(d);});
  
    gbut_g.selectAll('text')
          .data(graphs, (d,i) => i)
          .enter()
          .append('text')
    //        .attr('x', width-35 + extra_width)
    //        .attr('y', (d,i) => (i-2)*60 + height/2 + 15)
            .attr('x', (d,i) => i * button_width + (button_width/2))
            .attr('y', graph_y + (button_height / 2))
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr('id', (d, i) => "gbut"+i+"text")
            .text((d, i) => graph_names[i])
            .on('click', function(d){change_graph(d);});
  }

/*  function gen_custom_button() {
    const custom_x = button_x + 500;
  
    button_g.append('rect')
            .attr('x', custom_x)
            .attr('y', button_y + extra_height)
            .attr('width', button_width)
            .attr('height', button_height)
            .style('stroke', 'black')
            .style('stroke-width', 3)
            .style('fill', 'white')
            .attr("id", "customrect")
            .on('click', toggle_custom);
      
    button_g.append('text')
            .attr('x', custom_x + (button_width / 2))
            .attr('y', button_y + (button_height / 2) + extra_height)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("id", "customtext")
            .text("Click here customize!")
            .on('click', toggle_custom);
  } */
  
  function start(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g){
    button_g.select("#start_but_rect")
            .remove();
    button_g.select("#start_but_text")
            .remove();
    
    var delay = 250;
    var dur = 3000;
    
    gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g);
    guidance_animation(delay, dur);
  }

  button_g.append('rect')
          .attr('x', (width+extra_width - button_width)/2)
          .attr('y', (height+extra_height)/2)
          .attr('width', button_width)
          .attr('height', start_button_height)
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .style('fill', 'white')
          .attr("id", "start_but_rect")
          .on('click', function(){
            start(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g);
          });
    
  button_g.append('text')
          .attr('x', (width+extra_width)/2)
          .attr('y', (height+extra_height)/2 + (start_button_height / 2))
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .attr("id", "start_but_text")
          .text("Click to start!")
          .on('click', function(){
            start(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g);
          });

  // Adding decoding text
  text_g2.append("text")
    .attr("x", width + extra_width - 400)
    .attr("y", corruption_y - 70 + 50)
    .attr("alignment-baseline", "middle")
    .style("font-size", "28px")
    .style("fill","blue")
    .text("");
    //.style("opacity",0);
  
  const graphs = [get_duplication_code(msg_len, num_times), 
                  get_grouped_parity_check_code(), 
              //    get_johnsonlike_code(),
                  get_complete_code(),
              //    get_grassmannlike_code()
                  get_fano_code()
  ];

  const graph_names = ["Duplication Code",
                       "Parity Check Code",
              //         "Johnson Code",
                       "Complete Code",
                       "Grassmann Code"
  ];
  
  function change_graph(d){
    var id = d.srcElement.id;
    var idx = parseInt(id.slice(4, id.length - 3));
    sel_graph_id = idx;
    var res = graphs[sel_graph_id];
    
    gbut_g.selectAll('rect')
          .attr('fill', 'white');
    gbut_g.select("#gbut"+sel_graph_id+"rect")
          .transition()
          .attr('fill', 'lightgreen')
    
    gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g);
  }

  /* #################### BUILDS ENCODING AND DECODING ANIMATIONS #################### */

  // TODO change this back; this is zero to help speedup developing the decoding part
  var encode_duration = 1000; // 1000
  var encode_delay = 1000; // 1000
  
  // animation for encoding
  function encode_animation() {
    // disable all buttons during animation
    msg_g.selectAll("circle").style("fill", "white").on("click", null);
    msg_g.selectAll("text").on("click", null);
    red_g.selectAll("circle").style("fill", "white").on("click", null);
    red_g.selectAll("text").on("click", null);
    button_g.select("#buttontext").text("Encoding...").on("click", null);
    button_g.select("#buttonrect").on("click", null);
    gbut_g.selectAll('rect').on("click", null);
    gbut_g.selectAll("text").on("click", null);

    text_g.selectAll("*").remove();
    button_g.select("#default_button_rect").remove();
    button_g.select("#default_button_text").remove();

    for (var i = 0; i < red_len; i++) {
      var red_neighbors = red_adj[i];
      var str = "r" + i + " = m" + red_neighbors[0];
      for (var j = 1; j < red_neighbors.length; j++) {
        str += " ⊕ m" + red_neighbors[j];
      }
      
      // white out all nonrelevant edges
      edge_g.selectAll("line")
        .transition()
        .duration(encode_duration)
        .style("stroke", d => d[1]!=i ? "#D3D3D3" : "blue")
        .style("stroke-opacity", d => d[1]!=i ? 0.27  : 1)
        .style("stroke-width", d => d[1]!=i ? 2 : 5)
        .delay(encode_delay * i)
        .transition()
        .duration(encode_duration)
        .style("stroke", "black")
        .style("stroke-opacity",0.27)
        .style("stroke-width", 2);

      msg_g.selectAll("circle")
          .filter(d => red_neighbors.includes(d))
          .transition()
          .duration(encode_duration)
          .delay(encode_delay * i)
          .style("stroke", "blue")
          .style("stroke-width", 5)
          .transition()
          .duration(encode_duration)
          .style("stroke", "black")
          .style("stroke-width", 2);

      red_g.select("#" + bottom_circ_id(i))
          .transition()
          .duration(encode_duration)
          .delay(encode_delay * i)
          .style("stroke", "blue")
          .style("stroke-width", 5)
          .transition()
          .duration(encode_duration)
          .style("stroke", "black")
          .style("stroke-width", 2);

      // Adding encoding text
      text_g2.append("text")
          .attr("x", width + extra_width - 400)
          .attr("y", corruption_y - 70 + 50) 
          //.attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill","blue")
          .transition()
          .delay(encode_delay * i + 100)
          .duration(encode_duration/9*8)  
          //.text("r1 = m2 ⊕ m5")
          .text(str)
          //.attr("opacity",1)
          .transition()
          .text("")
          //.style("fill","red")
          //.attr("opacity",0);

      arrow_g.selectAll("path")
        .filter(function() { 
          var tid = d3.select(this).attr("id");
          return parseInt(tid.slice(tid.indexOf("b") + 1)) == i;
        })
        .transition()
        .duration(encode_duration)
        .style('stroke-width', 2)
        .style("stroke", "blue")
        .style("fill", "white")
        .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start, msg_len, width),msg_y+radius,bottom_index_to_x(end, red_len, width),red_y-radius,"end","down");
        })
       .delay(encode_delay * i)
       .transition()
       .duration(encode_duration)
       .style("stroke", "none")
       .style("stroke-width",0)
       .style("fill","none")
       .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start, msg_len, width),msg_y+2*radius,bottom_index_to_x(end, red_len, width),red_y-radius,"start","down");
        });
      
      red_bits[i] = xor_neighbors(i, red_adj, msg_bits);
      
      red_g.select("#" + bottom_text_id(i))
        .text("+")
        .attr("font-size",28)
        .transition()
        .text(red_bits[i])
        .attr("font-size",18)
        .delay(encode_delay * (i + 1));
    }

    // re-enables clicking the vertices
    var clickdelay = d3.timeout(function () {
      msg_g.selectAll("circle").on("click", corruption_toggle_message_bits);
      msg_g.selectAll("text").on("click", corruption_toggle_message_bits);
      red_g.selectAll("circle").on("click", corruption_toggle_message_bits);
      red_g.selectAll("text").on("click", corruption_toggle_message_bits);
      button_g.select("#buttontext").text("Click here to decode!").on("click", decode_animation);
      button_g.select("#buttonrect").on("click", decode_animation);

      // Merge all circles to one line
      msg_g.selectAll("circle")
        .transition()
        .duration(encode_duration)
        .style("stroke", "limegreen")
        .attr("cx", function (d) { return (d + 1) * (width / (red_len + msg_len + 1)); })
        .attr("cy", corruption_y);
      
      msg_g.selectAll("text")
        .transition()
        .duration(encode_duration)
        .attr("x", function (d) { return (d[0] + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      msglab_g.selectAll("text")
        .transition()
        .duration(encode_duration)
        .attr("x", function (d) { return (d[0] + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y+50)
        .attr("text-anchor", "middle")
        .style('fill', 'limegreen')
        .attr("alignment-baseline", "middle");
      
      red_g.selectAll("circle")
          .transition()
          .duration(encode_duration)
          .style("stroke", "dodgerblue")
          .attr("cx", function (d) { return (d + msg_len + 1) * (width / (red_len + msg_len + 1)); })
          .attr("cy", corruption_y);

      red_g.selectAll("text")
        .transition()
        .duration(encode_duration)
        .attr("x", function (d) { return (d[0] + msg_len + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      redlab_g.selectAll("text")
        .transition()
        .duration(encode_duration)
        .attr("x", function (d) { return (d[0] + msg_len + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y+50)
        .attr("text-anchor", "middle")
        .style('fill', 'dodgerblue')
        .attr("alignment-baseline", "middle");

      edge_g.selectAll("line")
          .transition()
          .duration(encode_duration)
          .style("stroke-opacity", 0);
      
      corr_g.append("text")
            .transition()
            .duration(encode_duration)
            .attr("id", "corruption_inst_txt")
            .attr("x", 50)
            .attr("y", corruption_y - 50)
            //.attr("text-anchor", "middle")
            //.attr("alignment-baseline", "middle")
            .style("font-size", "24px")
            .text("Now try to create errors by clicking the bits:");
      
      corr_g.append("text")
            .attr("id", "corruption_msgbits_txt")
            .attr("x", (msg_len / 2) * (width / (red_len + msg_len + 1)))
            .attr("y", corruption_y + 100)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style('fill', 'limegreen')
            .text("Message Bits.");
      
      corr_g.append("text")
            .attr("id", "corruption_redbits_txt")
            .attr("x", (msg_len + red_len / 2) * (width / (red_len + msg_len + 1)))
            .attr("y", corruption_y + 100)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style('fill', 'dodgerblue')
            .text("Redundancy Bits.");
      
    }, encode_delay * (red_len + 1));
    
  }

  var decode_duration = 1000; // 1000
  var decode_delay = 1000; // 1000

  // animation for decoding
  function decode_animation() {
    corr_g.selectAll("text").remove();

    // move all the circles and lines back
    msg_g.selectAll("circle")
      .transition()
      .duration(decode_duration)
      .style("stroke", "black")
      .attr("cx", d => top_index_to_x(d, msg_len, width))
      .attr("cy", msg_y);
    
    msg_g.selectAll("text")
      .transition()
      .duration(decode_duration)
      .attr("x", d => top_index_to_x(d[0], msg_len, width))
      .attr("y", msg_y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");

    msglab_g.selectAll("text")
      .transition()
      .duration(decode_duration)
      .attr("x", d => top_index_to_x(d[0], msg_len, width))
      .attr("y", msg_y - 40)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .attr("alignment-baseline", "middle");
    
    red_g.selectAll("circle")
      .transition()
      .duration(decode_duration)
      .style("stroke", "black")
      .attr("cx", d => bottom_index_to_x(d, red_len, width))
      .attr("cy", decode_red_y); 
    
    red_g.selectAll("text")
      .transition()
      .duration(decode_duration)
      .attr("x", d => bottom_index_to_x(d[0], red_len, width))
      .attr("y", decode_red_y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");

    redlab_g.selectAll("text")
      .transition()
      .duration(decode_duration)
      .attr("x", d => bottom_index_to_x(d[0], red_len, width))
      .attr("y", decode_red_y + 40)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .attr("alignment-baseline", "middle");

    vote_g.selectAll("circle")
      .transition()
      .duration(decode_duration)
      .style('stroke', "black")
      .style("fill","white")
      .style("stroke-opacity",1);
    

    /*text_g1.selectAll("text")
      .attr("x", width + extra_width - 400)
      .attr("y", corruption_y - 70)
          //.attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "18px")
      .style("fill","black")
      .transition()
      .duration(decode_duration)
      .text("Middle circles compute the beliefs of the redundancy") //bits about the `current' message bit")
      .append('svg:tspan')
      .attr('x', width + extra_width - 400)
      .attr("alignment-baseline", "middle")
      .attr('dy', 50)
      .text("bits about the `current' message bit")
      .transition()
      .text("");*/

    
    bellab_g.selectAll("text")
       .transition()
       .text(d => "b" + d[0]);
        
    edge_g.selectAll("line")
      .transition()
      .duration(decode_duration)
      .style("stroke-opacity", 1);

    belief_red_edges_g.selectAll('line')
      .transition()
      .duration(decode_duration)
      .style("stroke-opacity",1);

    var corrupted_msg = read_msg_bits_from_circles();
    var corrupted_red = read_red_bits_from_circles();
    var transcript = majority_decoding(msg_adj, red_adj, corrupted_msg, corrupted_red);

    // disable all buttons during animation
    msg_g.selectAll("circle").on("click", null);
    msg_g.selectAll("text").on("click", null);
    red_g.selectAll("circle").on("click", null);
    red_g.selectAll("text").on("click", null);
    button_g.select("#buttontext").text("Decoding...").on("click", null);
    button_g.select("#buttonrect").on("click", null);
    
    const deg = msg_adj[0].length;
    var t;
    var delayforvotecount = new Array(transcript.length);

    var animationdelay = d3.timeout(function () {
      if (transcript.length > 1) {
        decode_visualize_voters(0, transcript);
      }
    }, decode_delay);
  }

  // voters[0] -call-> voting[0] -call-> voters[1] -call-> voting[1] -call-> voters[2] ...
  function decode_visualize_voters(time_step, transcript) {
    var msg_idx = transcript[time_step][0];
    var neighbors = msg_adj[msg_idx];
    if (time_step < transcript.length - 1) {
      var neighbors = msg_adj[msg_idx];
      
      for (var j = 0; j < neighbors.length; j++) {
        
        vote_g.selectAll("circle")
          .filter(d => d==neighbors[j])
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5) // TODO
          .style("stroke", "red") // TODO
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 2)
          .style("stroke", "black");

        vote_g.selectAll("text")
              .filter(d => d==neighbors[j])
              .transition()
              .duration(decode_duration)
              .text("+")
              .attr("font-size", 28);
      }

      text_g1.append("text")
          .attr("x", width + extra_width - 400)
          .attr("y", corruption_y - 70)
          //.attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill", "red")
          //.delay(decode_delay*j) //TODO
          .transition()
          .duration(decode_duration)
          .text("Decoding m" + msg_idx)    // TODO
          //.attr("opacity",1)
          .transition()
          .text("")
          //.attr("opacity",0);
      
      edge_g.selectAll("line")
        .transition()
        .duration(decode_duration)
        .style("stroke", function(d) {
          return d[0] != msg_idx ? "#D3D3D3" : "black"; 
        })
        .style("stroke-opacity", function(d) {
          return d[0] != msg_idx ? 0.27 : 1; 
        });

      belief_red_edges_g.selectAll("line")
        .transition()
        .duration(decode_duration)
        .style("stroke", function(d) {
          var red_neighbors = red_adj[d];
          return red_neighbors.includes(msg_idx) ? "black" : "#D3D3D3"; 
        })
        .style("stroke-opacity", function(d) {
          var red_neighbors = red_adj[d];
          return red_neighbors.includes(msg_idx) ? 1 : 0.27; 
        });

      vote_g.selectAll("circle")
          .transition()
          .duration(decode_duration)
          .style("stroke", function(d) {
            var red_neighbors = red_adj[d];
            return red_neighbors.includes(msg_idx) ? "black" : "#D3D3D3"; 
          })
          .style("stroke-opacity", function(d) {
            var red_neighbors = red_adj[d];
            return red_neighbors.includes(msg_idx) ? 1 : 0.27; 
          });

      for (var j = 0; j < neighbors.length; j++) {
        vote_g.selectAll("circle")
          .filter(d => d==neighbors[j])
          .transition()
          .duration(decode_duration)
          .style("stroke-opacity",1)
          .style("stroke-width", 5) // TODO
          .style("stroke", "red") // TODO
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 2)
          .style("stroke", "black");
      }

      red_g.selectAll("circle")
        .transition()
        .duration(decode_duration)
        .style("stroke", d => neighbors.includes(d) ? "black" : "#D3D3D3")
        .style("stroke-opacity", d => neighbors.includes(d) ? 1 : 0.27)
        .transition()
        .duration(decode_duration);
      
      msg_g.selectAll("circle")
        .transition()
        .duration(decode_duration)
        .style("stroke-width", d=>d==msg_idx ? 5 : 2)
        .style("stroke", d=>d==msg_idx ? "red" : "grey")
        .style("stroke-opacity", d=>d==msg_idx ? 1 : 0.27)
        .transition()
        .duration(decode_duration)
        .style("stroke-width", 2)
        .style("stroke", d => d==msg_idx ? "black" : "grey")
        .style("stroke-opacity", d=>d==msg_idx ? 1 : 0.27)
        .on("end", function() {
          decode_visualize_voting(time_step, transcript, 0);
        });
    }
  }

  function decode_visualize_voting(time_step,transcript,j) {
      var msg_idx = transcript[time_step][0];
      var neighbors = msg_adj[msg_idx];   
      var votes = transcript[time_step][1];
      var maj_vote = majority(votes);

      var msg_neighbors = msg_adj[msg_idx];
      var red_idx = msg_neighbors[j];
      var red_neighbors = red_adj[red_idx];

      var str = "b" + red_idx + " = r" + red_idx;
      red_neighbors.forEach(d => d != msg_idx ? str += " ⊕ m" + d : str += "");


      /*text_g2.selectAll("text")
            .text(str)
            .transition()
            .style("opacity",1)
            .transition()
            .delay(decode_duration)
            .text("")
            .style("opacity",0);*/
    
      // Adding decoding text
      text_g2.append("text")
          .attr("x", width + extra_width - 400)
          .attr("y", corruption_y - 70 + 50) //need modification
          //.attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill","blue")
          //.attr("opacity",0)
          .transition()
          .text(str)
          //.delay(decode_delay)
          //.duration(decode_duration)  //need modification
          //.attr("opacity",1)
          .transition()
          .delay(decode_delay)
          .text("");
          //.attr("opacity",0); 

      msg_g.selectAll("circle")
          .filter(function(d) {
            return red_neighbors.includes(d) && d != msg_idx;
          })
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5)
          .style("stroke", "blue")
          .style("stroke-opacity", 1)
          .transition()
          .style("stroke-width", 2)
          .style("stroke", "black")
          .style("stroke-opacity", 0);

      edge_g.selectAll("line")
          .filter(function(d) {
            //debug.text(d[0] + " " + d[1]);
            return red_neighbors.includes(d[0]) && d[0] != msg_idx && d[1] == red_idx;
          })
          .style("stroke-opacity", 1)
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-width", 5)
          .transition()
          //.duration(encode_duration)
          .style("stroke", "grey")
          .style("stroke-width", 2)
          .style("stroke-opacity", 0.27);

      belief_red_edges_g.selectAll("line")
          .filter(d => d == red_idx)
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-width", 5)
          .transition()
          .style("stroke", "grey")
          .style("stroke-width", 2)
          .style("stroke-opacity", 0.27);

      vote_g.selectAll("circle")
          .filter(d => d == red_idx)
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-width", 5)
          .transition()
          .style("stroke", "black")
          .style("stroke-width", 2); //d => d == red_idx ? 1: 0.27)*/

      arrow_g.selectAll("path")
          .filter(function() { 
          var tid = d3.select(this).attr("id");
          return (parseInt(tid.slice(tid.indexOf("b") + 1)) == red_idx) && (parseInt(tid.slice(tid.indexOf("t") + 1)) != msg_idx);
          })
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-width", 2)
          .style("fill", "white")
          .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start, msg_len, width),msg_y+2*radius,bottom_index_to_x(end, red_len, width),red_y-radius,"end","down");
        })
        .transition()
        //.duration(decode_duration)
        .style("stroke", "none")
        .style("stroke-width",0)
        .style("fill","none")
        .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start, msg_len, width),msg_y+2*radius,bottom_index_to_x(end, red_len, width),red_y-radius,"start","down");
        });

      redtovote_arrow_g.select("#" + redtovote_edge_id(red_idx))
            .transition()
            .duration(decode_duration)
            .style("stroke", "blue")
            .style("fill", "white")
            .attr("d", function() { return mkTriangle(bottom_index_to_x(red_idx, red_len, width), decode_red_y - 2*radius, bottom_index_to_x(red_idx,red_len,width), red_y + radius, "end", "down"); })
            .transition()
            //.duration(decode_duration)
            .style("stroke", "none")
            .style("fill", "none")
            .attr("d", function() { return mkTriangle(bottom_index_to_x(red_idx, red_len, width), decode_red_y - 2*radius, bottom_index_to_x(red_idx, red_len, width), red_y + radius, "start", "down"); });

      vote_g.select("#" + vote_text_id(red_idx))
            .transition()
            .duration(decode_duration)
            .delay(decode_duration)
            .text(votes[j])
            .attr("font-size", 18);

      
      if (j < msg_neighbors.length - 1) {
        red_g.select("#" + bottom_circ_id(red_idx))
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5)
          .style("stroke", "blue")
          .transition()
          .style("stroke-width", 2)
          .style("stroke", "grey")
          .style("stroke-opacity", 0.27)
          .on("end", function() {
            decode_visualize_voting(time_step, transcript, j + 1);
          });

      } else {
        red_g.select("#" + bottom_circ_id(red_idx))
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5)
          .style("stroke", "blue")
          .transition()
          .style("stroke-width", 2)
          .style("stroke", "grey")
          .style("stroke-opacity", 0.27)
          .on("end", function() {
            for (var j = 0; j < neighbors.length; j++) {
              vote_g.selectAll("circle")
                .filter(d => d==neighbors[j])
                .transition()
                .duration(decode_duration)
                .style("stroke-width", 5)
                .style("stroke", "red")
                .transition()
                .duration(decode_duration)
                .style("stroke-width", 2)
                .style("stroke", "black");
            }

            vote_g.selectAll("circle")
                  .filter(d => neighbors.includes(d))
                  .transition()
                  .duration(decode_duration)
                  .style("stroke-width", 5)
                  .style("stroke", "red")
                  .style("stroke-opacity", 1)
                  .transition()
                  .duration(decode_duration)
                  .style("stroke-width", 2)
                  .style("stroke", "grey")
                  .style("stroke-opacity", 0.27);

            msg_g.select("#" + top_text_id(msg_idx))
                .transition()
                .duration(decode_duration)
                .text(maj_vote);
              
            msg_g.selectAll("circle")
                .transition()
                .duration(decode_duration)
                .style("stroke-width", d=>d==msg_idx ? 5 : 2)
                .style("stroke", d=>d==msg_idx ? "red" : "grey")
                .style("stroke-opacity", d=>d==msg_idx ? 1 : 0.27)
                .style("fill", function(d) {
                  if (d != msg_idx) {
                    return msg_g.select("#" + top_circ_id(d)).style("fill"); // keep current fill if not current message bit
                  } else {
                    return maj_vote != msg_bits[msg_idx] ? "salmon" : "white";
                  }
                })
                .transition()
                .duration(decode_duration)
                .style("stroke-width", 2)
                .style("stroke", d => d==msg_idx ? "black" : "grey")
                .style("stroke-opacity", d=>d==msg_idx ? 1 : 0.27);
            
            edge_g.selectAll("line")
                  .filter(d => d[0] == msg_idx)
                  .transition()
                  .duration(decode_duration)
                  .style("stroke-opacity", 1)
                  .style("stroke", "red")
                  .style("stroke-width", 5)
                  .transition()
                  //.duration(decode_duration)
                  .style("stroke", "grey")
                  .style("stroke-width", 2)
                  .style("stroke-opacity", 0.27);
            
            arrow_g.selectAll("path")
                  .filter(function() { 
                    var tid = d3.select(this).attr("id");
                    return parseInt(tid.slice(1, tid.indexOf(":"))) == msg_idx;
                  })
                  .attr("d",function (){
                    var tid = d3.select(this).attr("id");
                    var start = parseInt(tid.slice(1, tid.indexOf(":")));
                    var end = parseInt(tid.slice(tid.indexOf("b") + 1));
                    return mkTriangle(top_index_to_x(start, msg_len, width), msg_y+radius, bottom_index_to_x(end, red_len, width), red_y-radius, "end", "up");
                  })
                  .transition()
                  .duration(decode_duration)
                  .style("fill", "white")
                  .style("stroke", "red")
                  .style('stroke-width', 2)
                  .attr("d",function (){
                    var tid = d3.select(this).attr("id");
                    var start = parseInt(tid.slice(1, tid.indexOf(":")));
                    var end = parseInt(tid.slice(tid.indexOf("b") + 1));
                    return mkTriangle(top_index_to_x(start, msg_len, width),msg_y+radius,bottom_index_to_x(end, red_len, width),red_y-radius,"start","up");
                  })
                 .transition()
                 //.duration(decode_duration)
                 .style("stroke", "none")
                 .style("stroke-width",0)
                 .style("fill","none")
                 .attr("d",function (){
                    var tid = d3.select(this).attr("id");
                    var start = parseInt(tid.slice(tid.indexOf("t") + 1));
                    var end = parseInt(tid.slice(tid.indexOf("b") + 1));
                    return mkTriangle(top_index_to_x(start, msg_len, width),msg_y+2*radius,bottom_index_to_x(end, red_len, width),red_y-radius,"start","down");
                  });
            
            vote_g.selectAll("text")
                  .filter(function(d) {
                    return msg_neighbors.includes(d);
                  })
                  .transition()
                  .duration(decode_duration)
                  .delay(decode_duration)
                  .text("")
                  .on("end", function() { decode_visualize_voters(time_step + 1, transcript); });

            text_g1.append("text")
              .attr("x", width + extra_width - 400)
              .attr("y", corruption_y - 70)
              //.attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              .style("font-size", "28px")
              .style("fill", "red")
              //.delay(decode_delay*j) //TODO
              .transition()
              //.duration(decode_duration)
              .text(function () {
                var str = "m" + msg_idx + " = Majority(";
                msg_neighbors.forEach((d,i) => i < msg_neighbors.length - 1 ? str += "b" + d + "," : str += "b" + d + ")"); 
                return str; })    // TODO
          //.attr("opacity",1)
              .transition()
              .delay(decode_delay)
              .text("");
          //.attr("opacity",0);
            
            if (time_step == transcript.length - 2) {
              msg_g.selectAll("circle").on("click", precorruption_toggle_message_bits);
              msg_g.selectAll("text").on("click", precorruption_toggle_message_bits);
              red_g.selectAll("circle").on("click", precorruption_toggle_message_bits);
              red_g.selectAll("text").on("click", precorruption_toggle_message_bits);
              //button_g.select("#buttontext").text("Encode").on("click", encode_animation);
              //button_g.select("#buttonrect").on("click", encode_animation);
              gbut_g.selectAll("rect").on('click', function(d){change_graph(d);});
              gbut_g.selectAll("text").on('click', function(d){change_graph(d);});

              edge_g.selectAll("line")
                    .transition()
                    .duration(decode_duration)
                    .style("stroke", "black")
                    .style("stroke-opacity", 1);

              msg_g.selectAll("circle")
                .transition()
                .duration(decode_duration)
                .style("stroke", "black")
                .style("stroke-opacity",1)
                .style("stroke-width", 2)
                .style("fill", function(d) {
                  if (d != msg_idx) {
                    return msg_g.select("#" + top_circ_id(d)).style("fill"); // keep current fill if not current message bit
                  } else {
                    return maj_vote != msg_bits[msg_idx] ? "salmon" : "white";
                  }
                })
                .on("end", function (){
                  text_g.append("text")
                    .attr("x", width/2)
                    .attr("y", msg_y - 80)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .style("font-size", "24px")
                    .text(function (){
                      var count = 0;
                      
                      for (var i = 0; i < msg_len; i++) {
                          var cur_displayed_bit = parseInt(msg_g.select("#" + top_text_id(i)).text());
                          if (cur_displayed_bit != msg_bits[i]) {
                            count++;
                          }
                      }
        
                      var final_msg = "Decoding Finished!";
                      if (count == 0){
                        final_msg += " All errors in message bits  are corrected.";
                      } else {
                        final_msg += " Number of errors in messages not corrected: " + count + ".";
                      }
                      return final_msg;
                    })
                
                });

              vote_g.selectAll("circle")
                //  .filter()
                .transition()
                .duration(decode_duration)
                .style('stroke', "none")
                .style("fill","none")
                .style("stroke-opacity",0);

              bellab_g.selectAll("text")
                .transition()
                .text("");
              
         //       .attr("cx", d => top_index_to_x(d, msg_len, width))
         //       .attr("cy", msg_y); */ // why?

              red_g.selectAll("circle")
                .transition()
                .duration(decode_duration)
                .style("stroke", "black")
                .style("stroke-opacity",1)
                .style("stroke-width", 2)
                .attr("cx", d => bottom_index_to_x(d, red_len, width))
                .attr("cy", red_y);
              
              red_g.selectAll("text")
                .transition()
                .duration(decode_duration)
                .attr("x", d => bottom_index_to_x(d[0], red_len, width))
                .attr("y", red_y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .text("");

              belief_red_edges_g.selectAll('line')
                                .transition()
                                .duration(decode_duration)
                                .style("stroke-opacity",0);

             /* text_g.append("text")
                    .transition()
                    .delay(decode_delay)
                    .attr("x", width/2)
                    .attr("y", msg_y - 80)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .style("font-size", "24px")
                    .text(function (){
                      var count = 0;
                      
                      for (var i = 0; i < msg_len; i++) {
                          var cur_displayed_bit = parseInt(msg_g.select("#" + top_text_id(i)).text());
                          if (cur_displayed_bit != msg_bits[i]) {
                            count++;
                          }
                      }
        
                      var final_msg = "Decoding Finished!";
                      if (count == 0){
                        final_msg += " All errors in message bits  are corrected.";
                      } else {
                        final_msg += " Number of errors in messages not corrected: " + count + ".";
                      }
                      return final_msg;
                    });*/

              redlab_g.selectAll("text")
                    .transition()
                    .attr('y', red_y + 40)
              
              button_g.select("#buttontext")
                      .text("Back to default")
                      .on("click", function(){
                        var res = graphs[sel_graph_id];
                        gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g);
                        gen_encode_button();
                      });
              
              button_g.select("#buttonrect")
                      .on("click", function(){
                        var res = graphs[sel_graph_id];
                        gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g, vote_g, belief_red_edges_g, redtovote_arrow_g);
                        gen_encode_button();
                      });
            }
          });
    }
  }

  function read_msg_bits_from_circles() {
    var res = new Array(msg_len);
    for (var i = 0; i < msg_len; i++) {
      res[i] = parseInt(msg_g.select("#" + top_text_id(i)).text());
    }
    return res;
  }

  function read_red_bits_from_circles() {
    var res = new Array(red_len);
    for (var i = 0; i < red_len; i++) {
      res[i] = parseInt(red_g.select("#" + bottom_text_id(i)).text());
    }
    return res;
  }
/*
  function toggle_custom() {
    custom_mode = !custom_mode;
    if (custom_mode) {
      msg_g.selectAll("circle").on("mousedown", mousedown);
      red_g.selectAll("circle").on("mousedown", mousedown);
      edge_g.selectAll("line").on("click", deleteLine);
    } else {
      msg_g.selectAll("circle").on("mousedown", null);
      red_g.selectAll("circle").on("mousedown", null);
      edge_g.selectAll("line").on("click", null);
    }
  } */

  function mousedown(event) {
    var m = d3.pointer(event);
    startid = d3.select(this).attr("id");
    cur_edge = edge_g.append("line")
      .attr("x1", m[0])
      .attr("y1", m[1])
      .attr("x2", m[0])
      .attr("y2", m[1])
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("click", deleteLine);
    
    svg.on("mousemove", mousemove);
    msg_g.selectAll("circle").on("mouseup", mouseup).raise();
    red_g.selectAll("circle").on("mouseup", mouseup).raise();
  }

  function deleteLine() {
    var id = d3.select(this).attr('id');
    edge_g.select("#" + id).remove();
    arrow_g.select("#" + id).remove();
  }
  
  function mousemove(event) {
    var m = d3.pointer(event);
    cur_edge.attr("x2", m[0])
            .attr("y2", m[1]);
  }
  
  function mouseup() {
    // TODO: this doesn't register if you start with mousedown and release above the original start point
    svg.on("mousemove", null);
    var endid = d3.select(this).attr('id');

    if (startid == endid) { // prevent drawing line inside a circle
      cur_edge.remove();
    } else {
      // put endpoints of lines at center of the circles
      if (startid[0] == "t") {
        cur_edge.attr("x1", top_index_to_x(textcirc_id_to_idx(startid), msg_len, width))
                .attr("y1", msg_y + radius)
                .attr("x2", bottom_index_to_x(textcirc_id_to_idx(endid), red_len, width))
                .attr("y2", red_len - radius);
        arrow_g.append("path")
          .attr("d", d => mkTriangle(top_index_to_x(textcirc_id_to_idx(startid), msg_len, width), msg_y + 2*radius,bottom_index_to_x(textcirc_id_to_idx(endid),red_len,width),red_y - radius,"start","down"))
          .attr("id", edge_id)
          .style("stroke", "none")
          .style("fill","none")
          .style("stroke-width",2);
        edge_list.push([textcirc_id_to_idx(startid), textcirc_id_to_idx(endid)]);
      } else {
        cur_edge.attr("x1", top_index_to_x(textcirc_id_to_idx(endid), msg_len, width))
                .attr("y1", msg_y + radius)
                .attr("x2", bottom_index_to_x(textcirc_id_to_idx(startid), red_len, width))
                .attr("y2", red_len - radius);
        arrow_g.append("path")
          .attr("d", d => mkTriangle(top_index_to_x(textcirc_id_to_idx(endid), msg_len, width), msg_y + 2*radius,bottom_index_to_x(textcirc_id_to_idx(startid),red_len,width),red_y - radius,"start","down"))
          .attr("id", edge_id)
          .style("stroke", "none")
          .style("fill","none")
          .style("stroke-width",2);
        edge_list.push([textcirc_id_to_idx(endid), textcirc_id_to_idx(startid)]);
      }
      msg_adj = message_adjacencies(edge_list, msg_len);
      red_adj = redundancy_adjacencies(edge_list, red_len);
    }
  }

  

  return svg.node();
}


function _7(md){return(
md `
---
## Bipartite_text`
)}

function _bipartite_graph_text(get_duplication_code,get_vote,majority,message_adjacencies,redundancy_adjacencies,top_text_id,copy_top_text_id,d3,textcirc_id_to_idx,top_circ_id,bottom_text_id,bottom_circ_id,top_index_to_x,copy_top_circ_id,bottom_index_to_x,edge_id,mkTriangle,get_grouped_parity_check_code,get_johnsonlike_code,get_grassmannlike_code,get_hadamard_code,xor_neighbors)
{
  /* #################### DEFINES GRAPHS/CODES #################### */
  // NOTE: Only leave one type of code uncommented!
  // Design Decision: We only need to know the number of message bits and codeword bits. Each message bit will be just an index in {0,...,num_msg_bits - 1}, with ids "t0", "t1", etc. ("t" stands for "top"). Similarly, each redundancy bit will be an index in {0,...,num_red_bits - 1}, with ids "b0", "b1", etc. ("b" stands for "bottom").

  var msg_len = 3; // some codes take this as input while others don't
  var red_len = 3; // some codes take this as input while others don't
  var default_red_len = 3;
  var num_times = 4; // just for duplication code
  var copy_msg_opacity = 0;
  
  var res = get_duplication_code(msg_len, num_times);  
  
  const bracket_msg = res[0];
  const bracket_red = res[1];
  const edge_list = res[2];
  msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
  red_len = bracket_red.length; // depending on the code selected this might change red_len
  
  /* #################### DEFINES OTHER CONSTANTS AND HELPER FUNCTIONS #################### */
  const width = 1200;
  const height = 600;
  
  const radius = 15;
  const copy_msg_y = 50;
  const msg_y = 100; // verticle position of the message circles (top layer)
  const red_y = 500; // verticle position of the message circles (bottom layer)
  const corruption_y = 300;

  function majority_decoding(msg_adj, red_adj, corrupted_msg, corrupted_red) {
    var cur_msg = corrupted_msg.slice();
    var cur_red = corrupted_red.slice();
    var transcript = [];
    var allgood = false;
    var iterct = 0;
    const iterlim = 1000;
    while ((!allgood) && iterct < iterlim) {
      allgood = true;
      for (var i = 0; i < msg_len; i++) {
        var msg_i_neighbors = msg_adj[i];
        var votes = new Array(msg_i_neighbors.length);
        for (var j = 0; j < msg_i_neighbors.length; j++) {
          votes[j] = get_vote(i, msg_i_neighbors[j], red_adj, cur_msg, cur_red);
        }
        var maj_vote = majority(votes);
        transcript.push([i, votes]);
        if (maj_vote != cur_msg[i]) {
          allgood = false;
        }
        cur_msg[i] = maj_vote;
      }
      iterct += 1;
    }
    /*for (var j = 0; j < msg_len; j++) {
      transcript.pop();
    }*/
    transcript.push(allgood);
    return transcript;
  }

  /* #################### BUILDS THE ACTUAL VISUALIZATION #################### */

  // Start off by initializing necessary data structures such as the list of message bits.
  var msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
  var red_bits = bracket_red.map(function(d) {return ""}); // uncorrupted redundancy bits

  var msg_adj = message_adjacencies(edge_list,msg_len);
  var red_adj = redundancy_adjacencies(edge_list,red_len);

  // Implements toggling for the bits in the precorruption stage.
  function precorruption_toggle_message_bits(d) {
    // var id = d3.select(this).attr("id");
    var id = d.srcElement.id;
    var idx = parseInt(id.slice(1, id.length - 3)); // shave off the first character which is "b" or "t", and the last four character "text" or "circ"
    var ismsg = (id[0] == "t");

    if (ismsg) {
      msg_bits[idx] = msg_bits[idx] ^ 1;
      msg_g.select("#" + top_text_id(idx))
           .transition()
           .text(msg_bits[idx]);
      copy_msg_g.select("#" + copy_top_text_id(idx))
                .transition()
                .text(msg_bits[idx]);
    }
  }

  // Implements toggling for the bits in the corruption stage.
  function corruption_toggle_message_bits() {
    var id = d3.select(this).attr("id");
    var idx = textcirc_id_to_idx(id);
    var ismsg = (id[0] == "t");

    if (ismsg) {
      var cur_t = msg_g.select("#" + top_text_id(idx));
      var curbit = parseInt(cur_t.text());
      cur_t.transition()
           .text(curbit ^ 1);
      if (curbit ^ 1 != msg_bits[idx]) {
        msg_g.select("#" + top_circ_id(idx))  
          .transition()
          .style("fill", "salmon");
      } else {
        msg_g.select("#" + top_circ_id(idx))
          .transition()
          .style("fill", "white");
      }
    } else {
      var cur_t = red_g.select("#" + bottom_text_id(idx));
      var curbit = parseInt(cur_t.text());
      cur_t.transition()
        .text(curbit ^ 1);
      if (curbit ^ 1 != red_bits[idx]) {
        red_g.select("#" + bottom_circ_id(idx))
          .transition()
          .style("fill", "salmon");
      } else {
        red_g.select("#" + bottom_circ_id(idx))
          .transition()
          .style("fill", "white");
      }
    }
  }
  
  function show_hide_copy_message_bits() {
    copy_msg_opacity = (copy_msg_opacity == 1) ? 0 : 1;
    copy_msg_g.selectAll("text")
              .transition()
              .style("opacity", copy_msg_opacity);
    copy_msg_g.selectAll("circle")
              .transition()
              .style("opacity", copy_msg_opacity);
    
    if (copy_msg_opacity == 0) {
      d3.select("#showbuttontext")
        .transition()
        .text("Show Original Messages")
    } else {
      d3.select("#showbuttontext")
        .transition()
        .text("Hide Original Messages")
    }
  }
  
  function gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g) {
    msg_g.selectAll("*").remove();
    red_g.selectAll("*").remove();
    edge_g.selectAll("*").remove();
    arrow_g.selectAll("*").remove();
    text_g.selectAll("*").remove();
    button_g.select("#default_button_rect").remove();
    button_g.select("#default_button_text").remove();
    
    const bracket_msg = res[0];
    const bracket_red = res[1];
    const edge_list = res[2];
    
    msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
    red_len = bracket_red.length; // depending on the code selected this might change red_len

    msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
    red_bits = bracket_red.map(function(d) {return ""}); // uncorrupted redundancy bits
    
    msg_adj = message_adjacencies(edge_list, msg_len);
    red_adj = redundancy_adjacencies(edge_list, red_len);
  
    // Add circles at the top for message bits
    var msg_circs = msg_g.selectAll("circle")
        .data(bracket_msg, d => d.i)
        .enter()
        .append("circle")
          .attr("cx", d => top_index_to_x(d,msg_len))
          .attr("cy", msg_y)
          .attr("r", radius)
          .style("fill", "white")
          .style('stroke', 'black')
          .style('stroke-width', 2)
          .attr("id", d => top_circ_id(d))
          .on("click", function(d) {
            precorruption_toggle_message_bits(d)
          });

   
    // Add text for the top message bits
    var msg_text = msg_g.selectAll("text")
       .data(bracket_msg.map(d => [d, msg_bits[d]]))
       .join("text")
         .attr("x", d => top_index_to_x(d[0],msg_len))
         .attr("y", msg_y)
         .attr("id", d => top_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1])
         .on("click", function(d) {
           precorruption_toggle_message_bits(d)
         });

    // Add labels for msg bits
    var msg_lab = msglab_g.selectAll("text")
       .data(bracket_msg.map(d => [d, msg_bits[d]]))
       .join("text")
         .attr("x", d => top_index_to_x(d[0],msg_len))
         .attr("y", msg_y-50)
         .attr("id", d => top_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .style("font-size", "28px")
         .text(d => "m" + d[0]);
    
    copy_msg_g.selectAll("circle")
            .data(bracket_msg)
            .enter()
            .append("circle")
              .attr("cx", d => top_index_to_x(d,msg_len))
              .attr("cy", copy_msg_y)
              .attr("r", radius)
              .attr("fill", "white")
              .attr('stroke', 'black')
              .attr('stroke-width', 2)
              //.style("opacity", copy_msg_opacity)
              .style("opacity", 0)
              .attr("id", d => copy_top_circ_id(d));
  
    copy_msg_g.selectAll("text")
            .data(bracket_msg.map(d => [d, msg_bits[d]]))
            .join("text")
              .attr("x", d => top_index_to_x(d[0],msg_len))
              .attr("y", copy_msg_y)
              .attr("id", d => copy_top_text_id(d[0]))
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              //.style("opacity", copy_msg_opacity)
              .style("opacity", 0)
              .text(d => d[1]);
    
    // Add circles at the bottom for redundancy bits
    var red_circs = red_g.selectAll("circle")
        .data(bracket_red)
        .enter()
        .append("circle")
          .attr("cx", d => bottom_index_to_x(d,red_len))
          .attr("cy", red_y)
          .attr("r", radius)
          .style("fill", "white")
          .style('stroke', 'black')
          .style('stroke-width', 2)
          .attr("id", d => bottom_circ_id(d));
    
    // Add labels for redundancy bits
    var red_lab = redlab_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0],red_len))
         .attr("y", red_y+50)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .style("font-size", "28px")
         .text(d => "r" + d[0]);

    // Add text for the bottom redundancy bits
    var red_text = red_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0],red_len))
         .attr("y", red_y)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1]);

    // Add edges
    var edges = edge_g.selectAll("line")
      .data(edge_list)
      .enter()
      .append("line")
          .attr("x1", d => top_index_to_x(d[0],msg_len))
          .attr("y1", msg_y + radius)
          .attr("x2", d => bottom_index_to_x(d[1],red_len))
          .attr("y2", red_y - radius)
          .attr("id", edge_id)
          .style('stroke-width', 2)
          .style("stroke", "black")
          .style("stroke-opacity",1);

    var arrows = arrow_g.selectAll("path")
      .data(edge_list)
      .enter()
      .append("path")
          .attr("d", d => mkTriangle(top_index_to_x(d[0],msg_len),msg_y + 2*radius,bottom_index_to_x(d[1],red_len),red_y - radius,"start","down"))
          .attr("id", edge_id)
          .style("stroke", "none")
          .style("fill","none")
          .style("stroke-width",2);
  }
  
  // Start building actual visualization...
  const extra_width = 300
  const extra_height = 50
  const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width+extra_width, height+extra_height]);
  // set .text(...) here to whatever you want here to see variable values
  /*var debug = svg.append('text')
              .attr('x', 0)
              .attr('y', 15)
              .attr("dy", ".40em")
              .text("Use .text() to print debug info here! TODO: remove in final version");*/

  const msg_g = svg.append('g'); // group of circles for message bits
  const copy_msg_g = svg.append('g');
  const red_g = svg.append('g'); // group of circles for redundancy bits
  const edge_g = svg.append('g'); // group for edges across
  const gbut_g = svg.append('g'); // group for graph buttons
  const arrow_g = svg.append('g'); //group for arrows
  const text_g = svg.append('g'); // group for guidance text
  const text_g1 = svg.append('g'); // group for explanation function MAJ(...)
  const text_g2 = svg.append('g'); // group for belief calculation texts
  
  const button_g = svg.append('g');
  const corr_g = svg.append('g');
  const show_but_g = svg.append('g');

  const msglab_g = svg.append('g'); //group for msg labels
  const redlab_g =svg.append('g'); //group for red labels

  // // Add mouseover tooltip
  // var div = d3.select("body").append("div")
  //    .attr("class", "tooltip-donut")
  //    .style("opacity", 0);
  
  gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g);
  
  const graphs = [get_duplication_code(msg_len, num_times), 
                  get_grouped_parity_check_code(msg_len, default_red_len), 
                  get_johnsonlike_code(),
                  get_grassmannlike_code(),
                  get_hadamard_code()]
  
  function change_graph(d){
    console.log(msg_len);
    console.log(red_len);
    console.log(d.srcElement.id);
    var id = d.srcElement.id
    var idx = parseInt(id.slice(4, id.length - 3));
    var res = graphs[idx]
    
    gbut_g.selectAll('rect')
          .attr('fill', 'white');
    gbut_g.select("#gbut"+idx+"rect")
          .transition()
          .attr('fill', 'lightgreen')
    gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g);
  }
  
  gbut_g.selectAll('rect')
        .data(graphs, (d,i) => i)
        .enter()
        .append('rect')
          .attr('x', width - 50 + extra_width)
          .attr('y', (d,i) => i*60 + 165)
          .attr('width', 30)
          .attr('height', 30)
          .attr('stroke', 'black')
          .attr('stroke-width', 3)
          .attr('fill', function(d, i){
            return (i > 0) ? 'white':'lightgreen';
          })
          .attr('id', (d, i) => "gbut"+i+"rect")
          .on('click', function(d){change_graph(d);});
  
  gbut_g.selectAll('text')
        .data(graphs, (d,i) => i)
        .enter()
        .append('text')
          .attr('x', width-35 + extra_width)
          .attr('y', (d,i) => i*60 + 165 + 15)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr('id', (d, i) => "gbut"+i+"text")
          .text((d, i) => i)
          .on('click', function(d){change_graph(d);});

  /* #################### BUILDS ENCODING AND DECODING ANIMATIONS #################### */

  const button_width = 180;
  const button_height = 25;
  const button_x = 10;
  const button_y = 550;
  const show_but_x = width - 210;
  const show_but_width = 200;

  // Add button to trigger transition
  button_g.append('rect')
          .attr('x', button_x)
          .attr('y', button_y+ extra_height)
          .attr('width', button_width)
          .attr('height', button_height )
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .style('fill', 'white')
          .attr("id", "buttonrect")
          .on('click', encode_animation);
    
  button_g.append('text')
          .attr('x', button_x + (button_width / 2))
          .attr('y', button_y + (button_height / 2)+ extra_height)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("id", "buttontext")
          .text("Click here to encode!")
          .on('click', encode_animation);

  show_but_g.append('text')
            .attr('x', show_but_x + (show_but_width / 2))
            .attr('y', button_y + (button_height / 2)+ extra_height)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("id", "showbuttontext")
            .text("Show Original Messages");
            
  
  show_but_g.append('rect')
            .attr('x', show_but_x)
            .attr('y', button_y+ extra_height)
            .attr('width', show_but_width)
            .attr('height', button_height)
            .style('stroke', 'black')
            .style('stroke-width', 3)
            .style('fill', 'white')
            .style('fill-opacity', 0)
            .attr("id", "showbuttonrect")
            .on('click', show_hide_copy_message_bits);

  // TODO change this back; this is zero to help speedup developing the decoding part
  var encode_duration = 100;
  var encode_delay = 100;
  
  // animation for encoding
  function encode_animation() {
    // disable all buttons during animation
    msg_g.selectAll("circle").on("click", null);
    msg_g.selectAll("text").on("click", null);
    red_g.selectAll("circle").on("click", null);
    red_g.selectAll("text").on("click", null);
    button_g.select("#buttontext").text("Encoding...").on("click", null);
    button_g.select("#buttonrect").on("click", null);
    gbut_g.selectAll('rect').on("click", null);
    gbut_g.selectAll("text").on("click", null);

    text_g.selectAll("*").remove();
    button_g.select("#default_button_rect").remove();
    button_g.select("#default_button_text").remove();

    for (var i = 0; i < red_len; i++) {
      // white out all nonrelevant edges
      edge_g.selectAll("line")
        .filter(function() { 
          var eid = d3.select(this).attr("id");
          return parseInt(eid.slice(eid.indexOf("b") + 1)) != i;
        })
        .transition()
        .duration(encode_duration)
        .style("stroke", "#D3D3D3")
        .style("stroke-opacity",0.27)
        .delay(encode_delay * i)
        .transition()
        .duration(encode_duration)
        .style("stroke", "black")
        .style("stroke-opacity",1);

      // Adding decoding text
      text_g2.append("text")
          .attr("x", width + extra_width - 500)
          .attr("y", corruption_y - 70 + 50) 
          //.attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill","blue")
          .transition()
          .delay(encode_delay * i + 100)
          .duration(encode_duration/9*8)  
          .text("r1 = m2 ⊕ m5")
          //.attr("opacity",1)
          .transition()
          .text("")
          //.style("fill","red")
          //.attr("opacity",0);

      arrow_g.selectAll("path")
        /*.attr("d",function () {
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+radius,bottom_index_to_x(end,red_len),red_y-radius,"start","down");
        })*/
        .filter(function() { 
          var tid = d3.select(this).attr("id");
          return parseInt(tid.slice(tid.indexOf("b") + 1)) == i;
        })
        .transition()
        .duration(encode_duration)
        .style('stroke-width', 2)
        .style("stroke", "black")
        .style("fill", "white")
        .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+2*radius,bottom_index_to_x(end,red_len),red_y-radius,"end","down");
        })
       .delay(encode_delay * i)
       .transition()
       .duration(encode_duration)
       .style("stroke", "none")
       .style("stroke-width",0)
       .style("fill","none")
       .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+2*radius,bottom_index_to_x(end,red_len),red_y-radius,"start","down");
        });
      
      red_bits[i] = xor_neighbors(i, red_adj, msg_bits);
      
      red_g.select("#" + bottom_text_id(i))
        .transition()
        .text(red_bits[i])
        .delay(encode_delay * (i + 1));
    }

    // re-enables clicking the vertices
    var clickdelay = d3.timeout(function () {
      msg_g.selectAll("circle").on("click", corruption_toggle_message_bits);
      msg_g.selectAll("text").on("click", corruption_toggle_message_bits);
      red_g.selectAll("circle").on("click", corruption_toggle_message_bits);
      red_g.selectAll("text").on("click", corruption_toggle_message_bits);
      button_g.select("#buttontext").text("Click here to decode!").on("click", decode_animation);
      button_g.select("#buttonrect").on("click", decode_animation);

      // Merge all circles to one line
      msg_g.selectAll("circle")
        .transition()
        .duration(encode_duration)
        .style("stroke", "limegreen")
        .attr("cx", function (d) { return (d + 1) * (width / (red_len + msg_len + 1)); })
        .attr("cy", corruption_y);
      
      msg_g.selectAll("text")
        .transition()
        .duration(encode_duration)
        .attr("x", function (d) { return (d[0] + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
      
      red_g.selectAll("circle")
          .transition()
          .duration(encode_duration)
          .style("stroke", "dodgerblue")
          .attr("cx", function (d) { return (d + msg_len + 1) * (width / (red_len + msg_len + 1)); })
          .attr("cy", corruption_y);

      red_g.selectAll("text")
        .transition()
        .duration(encode_duration)
        .attr("x", function (d) { return (d[0] + msg_len + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      edge_g.selectAll("line")
          .transition()
          .duration(encode_duration)
          .style("stroke-opacity", 0);
      
      corr_g.append("text")
            .transition()
            .duration(encode_duration)
            .attr("id", "corruption_inst_txt")
            .attr("x", 50)
            .attr("y", corruption_y - 50)
            //.attr("text-anchor", "middle")
            //.attr("alignment-baseline", "middle")
            .style("font-size", "24px")
            .text("Now try to create errors by clicking the bits:");
      
      corr_g.append("text")
            .attr("id", "corruption_msgbits_txt")
            .attr("x", (msg_len / 2) * (width / (red_len + msg_len + 1)))
            .attr("y", corruption_y + 40)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style('fill', 'limegreen')
            .text("Message Bits.");
      
      corr_g.append("text")
            .attr("id", "corruption_redbits_txt")
            .attr("x", (msg_len + red_len / 2) * (width / (red_len + msg_len + 1)))
            .attr("y", corruption_y + 40)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style('fill', 'dodgerblue')
            .text("Redundancy Bits.");
      
    }, encode_delay * (red_len + 1));
    
  }

  var decode_duration = 100;
  var decode_delay = 100;

  // animation for decoding
  function decode_animation() {
    corr_g.selectAll("text").remove();

    // move all the circles and lines back
    msg_g.selectAll("circle")
      .transition()
      .duration(decode_duration)
      .style("stroke", "black")
      .attr("cx", d => top_index_to_x(d,msg_len))
      .attr("cy", msg_y);
    
    msg_g.selectAll("text")
      .transition()
      .duration(decode_duration)
      .attr("x", d => top_index_to_x(d[0], msg_len))
      .attr("y", msg_y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");
    
    red_g.selectAll("circle")
      .transition()
      .duration(decode_duration)
      .style("stroke", "black")
      .attr("cx", d => bottom_index_to_x(d, red_len))
      .attr("cy", red_y); 
    
    red_g.selectAll("text")
      .transition()
      .duration(decode_duration)
      .attr("x", d => bottom_index_to_x(d[0], red_len))
      .attr("y", red_y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");
    
    edge_g.selectAll("line")
      .transition()
      .duration(decode_duration)
      .style("stroke-opacity", 1);

    var corrupted_msg = read_msg_bits_from_circles();
    var corrupted_red = read_red_bits_from_circles();
    var transcript = majority_decoding(msg_adj, red_adj, corrupted_msg, corrupted_red);

    // disable all buttons during animation
    msg_g.selectAll("circle").on("click", null);
    msg_g.selectAll("text").on("click", null);
    red_g.selectAll("circle").on("click", null);
    red_g.selectAll("text").on("click", null);
    button_g.select("#buttontext").text("Decoding...").on("click", null);
    button_g.select("#buttonrect").on("click", null);
    
    const deg = msg_adj[0].length;
    var t;
    var delayforvotecount = new Array(transcript.length);

    var animationdelay = d3.timeout(function () {
      if (transcript.length > 1) {
        decode_visualize_voters(0, transcript);
      }
    }, decode_delay);
  }

  // voters[0] -call-> voting[0] -call-> voters[1] -call-> voting[1] -call-> voters[2] ...
  function decode_visualize_voters(time_step, transcript) {
    var msg_idx = transcript[time_step][0];
    var neighbors = msg_adj[msg_idx];
    if (time_step < transcript.length - 1) {
      var neighbors = msg_adj[msg_idx];

      
      for (var j = 0; j < neighbors.length; j++) {

        // Adding decoding text
        // text_g1.append("text")
        //     .attr("x", width + extra_width - 500)
        //     .attr("y", corruption_y - 70)
        //     //.attr("text-anchor", "middle")
        //     .attr("alignment-baseline", "middle")
        //     .style("font-size", "28px")
        //     .style("fill", "red")
        //     //.attr("opacity",0)
        //     .transition()
        //     .duration(decode_duration*(neighbors.length+5))
        //     .text("MAJ(b1,b2,b3...)")
        //     //.attr("opacity",1)
        //     .transition()
        //     .text("")
        //     //.attr("opacity",0);

        text_g1.append("text")
          .attr("x", width + extra_width - 500)
          .attr("y", corruption_y - 70)
          //.attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-size", "28px")
          .style("fill", "red")
          //.attr("opacity",0)
          .transition()
          .duration(decode_duration*(neighbors.length+5))
          .text("Decoding m1...")
          //.attr("opacity",1)
          .transition()
          .text("")
          //.attr("opacity",0);
        
        red_g.select("#" + bottom_circ_id(neighbors[j]))
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5) // TODO
          .style("stroke", "red") // TODO
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 2)
          .style("stroke", "black");
      }
      
      edge_g.selectAll("line")
        .transition()
        .duration(decode_duration)
        .style("stroke", function(d) {
          return d[0] != msg_idx ? "#D3D3D3" : "black"; 
        })
        .style("stroke-opacity", function(d) {
          return d[0] != msg_idx ? 0.27 : 1; 
        });

  
      msg_g.select("#" + top_circ_id(msg_idx))
        .transition()
        .duration(decode_duration)
        .style("stroke-width", 5)
        .style("stroke", "red")
        .transition()
        .duration(decode_duration)
        .style("stroke-width", 2)
        .style("stroke", "black")
        .on("end", function() {
          decode_visualize_voting(time_step, transcript, 0)
        });  
    }
  }

  function decode_visualize_voting(time_step,transcript,j) {
      var msg_idx = transcript[time_step][0];
      var votes = transcript[time_step][1];
      var maj_vote = majority(votes);

      var msg_neighbors = msg_adj[msg_idx];
      var red_idx = msg_neighbors[j];
      var red_neighbors = red_adj[red_idx];

      var str = 'b' + red_idx + ' = r' + red_idx;
      red_neighbors.forEach(d => d != msg_idx ? str += ' + m' + d : str += '');

      // Adding decoding text
        text_g2.append("text")
            .attr("x", width + extra_width - 500)
            .attr("y", corruption_y - 70 + 50) //need modification
            //.attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "28px")
            .style("fill","blue")
            //.attr("opacity",0)
            .transition()
            .duration(decode_duration)  //need modification
            .text(str)
            //.attr("opacity",1)
            .transition()
            //.text("")
            .attr("opacity",0);
    
      msg_g.selectAll("circle")
          .filter(function(d) {
            return red_neighbors.includes(d) && d != msg_idx;
          })
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5)
          .style("stroke", "blue")
          .transition()
          .style("stroke-width", 2)
          .style("stroke", "black");

      edge_g.selectAll("line")
          .filter(function(d) {
            //debug.text(d[0] + " " + d[1]);
            return red_neighbors.includes(d[0]) && d[0] != msg_idx && d[1] == red_idx;
          })
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-opacity", 1)
          .transition()
          //.duration(encode_duration)
          .style("stroke", "black")
          .style("stroke-opacity", 0.27);

        //.duration(encode_duration);
      
      if (j < msg_neighbors.length - 1) {
        arrow_g.selectAll("path")
          .filter(function() { 
          var tid = d3.select(this).attr("id");
          return (parseInt(tid.slice(tid.indexOf("b") + 1)) == red_idx) && (parseInt(tid.slice(tid.indexOf("t") + 1)) != msg_idx);
          })
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-width", 2)
          .style("fill", "white")
          .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+2*radius,bottom_index_to_x(end,red_len),red_y-radius,"end","down");
        })
        .transition()
        .duration(decode_duration)
        .style("stroke", "none")
        .style("stroke-width",0)
        .style("fill","none")
        .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+2*radius,bottom_index_to_x(end,red_len),red_y-radius,"start","down");
        });
        
        red_g.select("#" + bottom_circ_id(red_idx))
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5)
          .style("stroke", "blue")
          .transition()
          .style("stroke-width", 2)
          .style("stroke", "black")
          .on("end", function() {
            decode_visualize_voting(time_step, transcript, j + 1);
          });

      } else {
        arrow_g.selectAll("path")
          .filter(function() { 
          var tid = d3.select(this).attr("id");
          return (parseInt(tid.slice(tid.indexOf("b") + 1)) == red_idx) && (parseInt(tid.slice(tid.indexOf("t") + 1)) != msg_idx);
          })
          .transition()
          .duration(decode_duration)
          .style("stroke", "blue")
          .style("stroke-width", 2)
          .style("fill", "white")
          .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+2*radius,bottom_index_to_x(end,red_len),red_y-radius,"end","down");
        })
        .transition()
        .duration(decode_duration)
        .style("stroke", "none")
        .style("stroke-width",0)
        .style("fill","none")
        .attr("d",function (){
          var tid = d3.select(this).attr("id");
          var start = parseInt(tid.slice(tid.indexOf("t") + 1));
          var end = parseInt(tid.slice(tid.indexOf("b") + 1));
          return mkTriangle(top_index_to_x(start,msg_len),msg_y+2*radius,bottom_index_to_x(end,red_len),red_y-radius,"start","down");
        });
        
        red_g.select("#" + bottom_circ_id(red_idx))
          .transition()
          .duration(decode_duration)
          .style("stroke-width", 5)
          .style("stroke", "blue")
          .transition()
          .style("stroke-width", 2)
          .style("stroke", "black")
          .on("end", function() {
            msg_g.select("#" + top_text_id(msg_idx))
                .transition()
                .duration(decode_duration)
                .text(maj_vote);
            if (maj_vote != msg_bits[msg_idx]) {
              msg_g.select("#" + top_circ_id(msg_idx))
                  .transition()
                  .duration(decode_duration)
                  .style("fill", "salmon");
            } else {
              /*svg.append("text")
                 .attr("x", top_index_to_x(msg_idx, msg_len))
                 .attr("y", msg_y - 30)
                 .text("Error Corrected!")*/
              msg_g.select("#" + top_circ_id(msg_idx))
                  .transition()
                  .duration(decode_duration)
                  .style("fill", "white");
            }
            
            decode_visualize_voters(time_step + 1, transcript);
            if (time_step == transcript.length - 2) {
              msg_g.selectAll("circle").on("click", precorruption_toggle_message_bits);
              msg_g.selectAll("text").on("click", precorruption_toggle_message_bits);
              red_g.selectAll("circle").on("click", precorruption_toggle_message_bits);
              red_g.selectAll("text").on("click", precorruption_toggle_message_bits);
              button_g.select("#buttontext").text("Encode").on("click", encode_animation);
              button_g.select("#buttonrect").on("click", encode_animation);
              gbut_g.selectAll("rect").on('click', function(d){change_graph(d);});
              gbut_g.selectAll("text").on('click', function(d){change_graph(d);});

              edge_g.selectAll("line")
                    .transition()
                    .duration(encode_duration)
                    .style("stroke", "black")
                    .style("stroke-opacity", 1);
              
              var count = 0;
              for (var i = 0; i < msg_len; i++) {
                  var cur_displayed_bit = parseInt(msg_g.select("#" + top_text_id(i)).text());
                  if (cur_displayed_bit != msg_bits[i]) {
                    count++;
                  }
              }

              var final_msg = "Decoding Finished!";
              if (count == 0){
                final_msg += " All Message Bits Errors are Corrected.";
              } else {
                final_msg += " Number of Errors Not Corrected: " + count + ".";
              }

              text_g.append("text")
                    .attr("x", width/2-120)
                    .attr("y", 10)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .style("font-size", "24px")
                    .text(final_msg);

              button_g.append('rect')
                    .attr('x', button_x + button_width + 50)
                    .attr('y', button_y + extra_height)
                    .attr('width', button_width)
                    .attr('height', button_height)
                    .style('stroke', 'black')
                    .style('stroke-width', 3)
                    .style('fill', 'white')
                    .attr("id", "default_button_rect")
                    .on('click', function(){
                      gbut_g.selectAll('rect')   
                            .attr('fill', function(d, i){
                              return (i > 0) ? 'white':'lightgreen';
                            });
                      gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g);
                    })
    
              button_g.append('text')
                    .attr('x', button_x + (button_width / 2) + button_width +50)
                    .attr('y', button_y + (button_height / 2) + extra_height)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr("id", "default_button_text")
                    .text("Back to default")
                    .on('click', function(){
                      gbut_g.selectAll('rect')   
                            .attr('fill', function(d, i){
                              return (i > 0) ? 'white':'lightgreen';
                            });
                      gen_vis(res, msg_g, red_g, edge_g, arrow_g, button_g);
                    })
              
              // debug.text("Decoding Finished! ").transition().duration(5000);

              // gen_vis(res, msg_g, red_g, edge_g, arrow_g);

/*              debug.text(transcript[transcript.length - 1]);
              if (transcript[transcript.length - 1]) {
                for (var i = 0; i < msg_len; i++) {
                  var cur_displayed_bit = parseInt(msg_g.select("#" + top_text_id(i)).text());
                  if (cur_displayed_bit != msg_bits[i]) {
                  //  debug.text("Too many corruptions!"); // TODO: instead of debug add an actual textbox for this
                  }
                }
              } */
            }
          });
    }
  }

  function read_msg_bits_from_circles() {
    var res = new Array(msg_len);
    for (var i = 0; i < msg_len; i++) {
      res[i] = parseInt(msg_g.select("#" + top_text_id(i)).text());
    }
    return res;
  }

  function read_red_bits_from_circles() {
    var res = new Array(red_len);
    for (var i = 0; i < red_len; i++) {
      res[i] = parseInt(red_g.select("#" + bottom_text_id(i)).text());
    }
    return res;
  }

  return svg.node();
}


function _d3(require){return(
require("d3@6")
)}

function _preset_graphs(){return(
["Duplication", "Group Parity Check", "Johnson", "Grassmann", "Hadamard"]
)}

function _11(md){return(
md` 
### Helper functions`
)}

function _get_grouped_parity_check_code(bracket_n){return(
function get_grouped_parity_check_code() {
  const bracket_msg = bracket_n(5);
  const bracket_red = bracket_n(1);
  const edge_list = bracket_msg.map(function(d) {return [d, Math.floor(d / 5)]});
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _get_duplication_code(bracket_n,get_duplication_edges){return(
function get_duplication_code(msg_len, num_times) {
  const red_len = msg_len * num_times; // number of added redundancy bits
  const bracket_msg = bracket_n(msg_len);
  const bracket_red = bracket_n(red_len);
  const edge_list = get_duplication_edges(msg_len, num_times);
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _get_johnsonlike_code(bracket_n){return(
function get_johnsonlike_code() {
  const msg_len = 10; // input message length
  const red_len = 10; // number of added redundancy bits
  const bracket_msg = bracket_n(msg_len);
  const bracket_red = bracket_n(red_len);
  // TODO: this drawing of this graph is definitely suboptimal... but it still seems too big
  const edge_list = [[0, 7], [0, 8], [0, 9], [1, 5], [1, 6], [1, 9], [2, 4], [2, 6], [2, 8], [3, 4], [3, 5], [3, 7], [4, 2], [4, 3], [4, 9], [5, 1], [5, 3], [5, 8], [6, 1], [6, 2], [6, 7], [7, 0], [7, 3], [7, 6], [8, 0], [8, 2], [8, 5], [9, 0], [9, 1], [9, 4]]; // TODO slightly incorrect
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _get_complete_code(bracket_n,bipartite_graph_from_hypergraph){return(
function get_complete_code() {
  const msg_len = 6; // input message length
  const red_len = 15; // number of added redundancy bits
  const complete_edges = [];
  for (var i = 0; i < msg_len; i++) {
    for (var j = 0; j < i; j++) {
      complete_edges.push([j, i]);
    }
  }
  const bracket_msg = bracket_n(msg_len);
  const bracket_red = bracket_n(red_len);
  const edge_list = bipartite_graph_from_hypergraph(bracket_msg, complete_edges);
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _get_fano_code(bracket_n,bipartite_graph_from_hypergraph){return(
function get_fano_code() {
  const msg_len = 7; // input message length
  const fano_flats = [[0, 1, 2], [2, 3, 4], [0, 4, 5], [0, 3, 6], [1, 4, 6], [2, 5, 6], [1, 3, 5]];
  const red_len = fano_flats.length; // number of added redundancy bits
  const bracket_msg = bracket_n(msg_len);
  const bracket_red = bracket_n(red_len);
  const edge_list = bipartite_graph_from_hypergraph(bracket_msg, fano_flats);
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _get_grassmannlike_code(bracket_n,bipartite_graph_from_hypergraph){return(
function get_grassmannlike_code() {
  const msg_len = 7; // input message length
  const subspaces = [];
  const red_len = subspaces.length; // number of added redundancy bits
  const bracket_msg = bracket_n(msg_len);
  const bracket_red = bracket_n(red_len);
  const edge_list = bipartite_graph_from_hypergraph(bracket_msg, subspaces);
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _bipartite_graph_from_hypergraph(){return(
function bipartite_graph_from_hypergraph(V, E) {
  var bip_edges = [];
  for (var i = 0; i < E.length; i++) {
    var e = E[i];
    for (var j = 0; j < e.length; j++) {
      bip_edges.push([e[j], i])
    }
  }
  return bip_edges;
}
)}

function _get_hadamard_code(bracket_n){return(
function get_hadamard_code() {
  const msg_len = 3; // input message length
  const red_len = 9; // number of added redundancy bits
  const bracket_msg = bracket_n(msg_len);
  const bracket_red = bracket_n(red_len);
  const edge_list = bracket_msg.map(function(d) {return [d, Math.floor(d / (msg_len / red_len))]});
  return [bracket_msg, bracket_red, edge_list];
}
)}

function _top_index_to_x(){return(
function top_index_to_x(d, msg_len, width){
    return (d + 1) * (width / (msg_len + 1));
  }
)}

function _bottom_index_to_x(){return(
function bottom_index_to_x(d, red_len, width) {
    return (d + 1) * (width / (red_len + 1));
  }
)}

function _bracket_n(){return(
function bracket_n(n) {
    var arr = new Array(n);
    for (var i = 0; i < n; i++) {
      arr[i] = i
    }
    return arr;
  }
)}

function _top_circ_id(){return(
function top_circ_id(idx) {
    return "t" + idx + "circ";
  }
)}

function _bottom_circ_id(){return(
function bottom_circ_id(idx) {
    return "b" + idx + "circ";
  }
)}

function _redtovote_edge_id(){return(
function redtovote_edge_id(idx) {
  return "b" + idx + "edge";
}
)}

function _vote_box_id(){return(
function vote_box_id(idx) {
  return "v" + idx + "box ";
}
)}

function _vote_text_id(){return(
function vote_text_id(idx) {
  return "v" + idx + "text";
}
)}

function _top_text_id(){return(
function top_text_id(idx) {
    return "t" + idx + "text";
  }
)}

function _bottom_text_id(){return(
function bottom_text_id(idx) {
    return "b" + idx + "text";
  }
)}

function _copy_top_circ_id(){return(
function copy_top_circ_id(idx) {
    return "c" + idx + "circ";
}
)}

function _copy_top_text_id(){return(
function copy_top_text_id(idx) {
    return "c" + idx + "text";
}
)}

function _textcirc_id_to_idx(){return(
function textcirc_id_to_idx(id) {
  return parseInt(id.slice(1, id.length - 3)); // first character is "t"/"b"/"c" and last four characters are "text"/"circ"
}
)}

function _edge_id(){return(
function edge_id(pair) {
    return "t" + pair[0] + ":b" + pair[1];
//    return "m" + pair[0] + ":r" + pair[1];
  }
)}

function _message_adjacencies(){return(
function message_adjacencies(edge_list,msg_len) {
    var adj = new Array(msg_len);
    for (var i = 0; i < msg_len; i++) {
      adj[i] = []
    }
    for (var i = 0; i < edge_list.length; i++) {
      var e = edge_list[i];
      var msg_idx = e[0];
      var red_idx = e[1];
      adj[msg_idx].push(red_idx);
    }
    return adj;
  }
)}

function _redundancy_adjacencies(){return(
function redundancy_adjacencies(edge_list,red_len) {
    var adj = new Array(red_len);
    for (var i = 0; i < red_len; i++) {
      adj[i] = []
    }
    for (var i = 0; i < edge_list.length; i++) {
      var e = edge_list[i];
      var msg_idx = e[0];
      var red_idx = e[1];
      adj[red_idx].push(msg_idx);
    }
    return adj;
  }
)}

function _xor_neighbors(){return(
function xor_neighbors(idx, red_adj,msg_bits) {
    var neighbors = red_adj[idx];
    var res = 0;
    for (var i = 0; i < neighbors.length; i++) {
      var b = msg_bits[neighbors[i]];
      res = res ^ b;
    }
    return res;
  }
)}

function _majority(){return(
function majority(bits) {
  var ctzero = 0;
  for (var i = 0; i < bits.length; i++) {
    if (bits[i] == 0) {
      ctzero += 1;
    }
  }
  if (ctzero >= bits.length / 2) {
    return 0;
  } else {
    return 1;
  }
}
)}

function _get_vote(){return(
function get_vote(msg_idx, red_idx, red_adj, corrupted_msg_bits, corrupted_red_bits) {
  var res = corrupted_red_bits[red_idx];
  for (var i = 0; i < red_adj[red_idx].length; i++) {
    if (red_adj[red_idx][i] != msg_idx) {
      res = res ^ corrupted_msg_bits[red_adj[red_idx][i]];
    }
  }
  return res;
}
)}

function _get_duplication_edges(){return(
function get_duplication_edges(msg_len, num_times){
  var res = [];
  for (var i = 0; i < msg_len; i++) {
    for (var j = 0; j < num_times; j++) {
      res.push([i, (i * num_times) + j]);
    }
  }
  return res;
}
)}

function _precorruption_toggle_message_bits(d3,top_text_id,bottom_text_id){return(
function precorruption_toggle_message_bits(msg_bits,red_bits) {
    var id = d3.select(this).attr("id");
    var idx = parseInt(id.slice(1, id.length - 3)); // shave off the first character which is "b" or "t", and the last four character "text" or "circ"
    var ismsg = (id[0] == "t");

    if (ismsg) {
      msg_bits[idx] = msg_bits[idx] ^ 1;
      d3.select("#" + top_text_id(idx))
        .transition()
        .text(msg_bits[idx]);
    } else {
      red_bits[idx] = red_bits[idx] ^ 1;
      d3.select("#" + bottom_text_id(idx))
        .transition()
        .text(red_bits[idx]);
    }
  }
)}

function _mkTriangle(d3){return(
function mkTriangle(x1,y1,x2,y2,startend,updown) {

  const theta = 30*Math.PI/180;
  const arrow_length = 20;
  
  var dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  var arrow_left_x = arrow_length*((x1-x2)*Math.cos(theta) + (y2-y1)*Math.sin(theta))/dist;
  var arrow_left_y = arrow_length*((y2-y1)*Math.cos(theta) - (x1-x2)*Math.sin(theta))/dist;
  var arrow_right_x = arrow_length*((x1-x2)*Math.cos(theta) - (y2-y1)*Math.sin(theta))/dist;
  var arrow_right_y = arrow_length*((y2-y1)*Math.cos(theta) + (x1-x2)*Math.sin(theta))/dist;
  
  var triangle = d3.path();
  if (updown == "down") {
  if(startend == "start") {
  
    triangle
          .moveTo(x1 + arrow_left_x, y1 - arrow_left_y);
  
    triangle
          .lineTo(x1,y1);
  
    triangle
          .lineTo(x1 + arrow_right_x, y1 - arrow_right_y);
  
    triangle.closePath();
  }
  else {
    triangle
          .moveTo(x2 + arrow_left_x, y2 - arrow_left_y);
  
    triangle
          .lineTo(x2,y2);
  
    triangle
          .lineTo(x2 + arrow_right_x, y2 - arrow_right_y);
  
    triangle.closePath();
  }
  } else {
    if(startend == "start") {
  
    triangle
          .moveTo(x1 - arrow_left_x, y1 + arrow_left_y);
  
    triangle
          .lineTo(x1,y1);
  
    triangle
          .lineTo(x1 - arrow_right_x, y1 + arrow_right_y);
  
    triangle.closePath();
  } else {
      triangle
          .moveTo(x2 - arrow_left_x, y2 + arrow_left_y);
  
    triangle
          .lineTo(x2,y2);
  
    triangle
          .lineTo(x2 - arrow_right_x, y2 + arrow_right_y);
    }
  }

  
/*  const scale = 0.05
  var origin = [x1, y1];
  var other = [x2, y2];
  if (startend == "end") {
    var temp = origin;
    origin = other;
    other = temp;
  }
  var dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  var phi = Math.acos((other[0] - origin[0]) / dist);

  var left_angle = 0;
  var right_angle = 0;
  if ((updown == "up" && startend == "start") || (updown == "down" && startend == "end")) {
    left_angle = phi + theta;
    right_angle = phi - theta;
  } else {
    left_angle = Math.PI + phi + theta;
    right_angle = Math.PI + phi - theta;
  }
//  var sidelen = Math.abs(scale * dist * Math.cos(theta));
  const sidelen = 20;
  var arrow_left_x = sidelen * Math.cos(left_angle);
  var arrow_left_y = sidelen * Math.sin(left_angle);
  var arrow_right_x = sidelen * Math.cos(right_angle);
  var arrow_right_y = sidelen * Math.sin(right_angle);*/

/*  var triangle = d3.path();
  triangle.moveTo(origin[0], origin[1]);
  triangle.lineTo(origin[0] + arrow_left_x, origin[1] - arrow_left_y); // "left" point
  triangle.lineTo(origin[0] + arrow_right_x, origin[1] - arrow_right_y); // "right" point
  triangle.closePath()*/
  return triangle;
}
)}

function _bipartite_graph(get_duplication_code,get_vote,majority,message_adjacencies,redundancy_adjacencies,d3,top_text_id,copy_top_text_id,bottom_text_id,top_circ_id,bottom_circ_id,top_index_to_x,copy_top_circ_id,bottom_index_to_x,edge_id,get_grouped_parity_check_code,get_johnsonlike_code,get_grassmannlike_code,get_hadamard_code,xor_neighbors,textcirc_id_to_idx)
{
  /* #################### DEFINES GRAPHS/CODES #################### */
  // NOTE: Only leave one type of code uncommented!
  // Design Decision: We only need to know the number of message bits and codeword bits. Each message bit will be just an index in {0,...,num_msg_bits - 1}, with ids "t0", "t1", etc. ("t" stands for "top"). Similarly, each redundancy bit will be an index in {0,...,num_red_bits - 1}, with ids "b0", "b1", etc. ("b" stands for "bottom").

  var msg_len = 3; // some codes take this as input while others don't
  var red_len = 3; // some codes take this as input while others don't
  var default_red_len = 3;
  var num_times = 3; // just for duplication code
  var copy_msg_opacity = 0;
  
  var res = get_duplication_code(msg_len, num_times);  
  
  const bracket_msg = res[0];
  const bracket_red = res[1];
  const edge_list = res[2];
  msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
  red_len = bracket_red.length; // depending on the code selected this might change red_len
  
  /* #################### DEFINES OTHER CONSTANTS AND HELPER FUNCTIONS #################### */
  const width = 1200;
  const height = 600;
  
  const radius = 15;
  const copy_msg_y = 50;  // verticle position of the reserved original messages (top layer)
  const msg_y = 100; // verticle position of the message circles (top layer)
  const red_y = 500; // verticle position of the message circles (bottom layer)
  const corruption_y = 300;

  function majority_decoding(msg_adj, red_adj, corrupted_msg, corrupted_red) {
    var cur_msg = corrupted_msg.slice();
    var cur_red = corrupted_red.slice();
    var transcript = [];
    var allgood = false;
    var iterct = 0;
    const iterlim = 1000;
    while ((!allgood) && iterct < iterlim) {
      allgood = true;
      for (var i = 0; i < msg_len; i++) {
        var msg_i_neighbors = msg_adj[i];
        var votes = new Array(msg_i_neighbors.length);
        for (var j = 0; j < msg_i_neighbors.length; j++) {
          votes[j] = get_vote(i, msg_i_neighbors[j], red_adj, cur_msg, cur_red);
        }
        var maj_vote = majority(votes);
        transcript.push([i, maj_vote, msg_i_neighbors, votes]);
        if (maj_vote != cur_msg[i]) {
          allgood = false;
        }
        cur_msg[i] = maj_vote;
      }
      iterct += 1;
    }
    transcript.push(allgood);
    return transcript;
  }

  /* #################### BUILDS THE ACTUAL VISUALIZATION #################### */

  // Start off by initializing necessary data structures such as the list of message bits.
  var msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
  var red_bits = bracket_red.map(function(d) {return ""}); // uncorrupted redundancy bits

  var msg_adj = message_adjacencies(edge_list,msg_len);
  var red_adj = redundancy_adjacencies(edge_list,red_len);

  // Implements toggling for the bits in the precorruption stage.
  function precorruption_toggle_message_bits(d) {
    // var id = d3.select(this).attr("id");
    console.log(d);
    var id = d.srcElement.id;
    var idx = parseInt(id.slice(1, id.length - 3)); // shave off the first character which is "b" or "t", and the last four character "text" or "circ"
    var ismsg = (id[0] == "t");

    if (ismsg) {
      msg_bits[idx] = msg_bits[idx] ^ 1;
      d3.select("#" + top_text_id(idx))
        .transition()
        .text(msg_bits[idx]);
      d3.select("#" + copy_top_text_id(idx))
        .transition()
        .text(msg_bits[idx]);
    } else {
      red_bits[idx] = red_bits[idx] ^ 1;
      d3.select("#" + bottom_text_id(idx))
        .transition()
        .text(red_bits[idx]);
    }
  }

  // Implements toggling for the bits in the corruption stage.
  function corruption_toggle_message_bits() {
    var id = d3.select(this).attr("id");
    var idx = parseInt(id.slice(1, id.length - 3)); // shave off the first character which is "b" or "t", and the last four character "text" or "circ"
    var ismsg = (id[0] == "t");

    if (ismsg) {
      var curbit = parseInt(d3.select("#" + top_text_id(idx)).text());
      d3.select("#" + top_text_id(idx))
        .transition()
        .text(curbit ^ 1);
      if (curbit ^ 1 != msg_bits[idx]) {
        d3.select("#" + top_circ_id(idx))
          .transition()
          .attr("fill", "salmon");
      } else {
        d3.select("#" + top_circ_id(idx))
          .transition()
          .attr("fill", "white");
      }
    } else {
      var curbit = parseInt(d3.select("#" + bottom_text_id(idx)).text());
      d3.select("#" + bottom_text_id(idx))
        .transition()
        .text(curbit ^ 1);
      if (curbit ^ 1 != red_bits[idx]) {
        d3.select("#" + bottom_circ_id(idx))
          .transition()
          .attr("fill", "salmon");
      } else {
        d3.select("#" + bottom_circ_id(idx))
          .transition()
          .attr("fill", "white");
      }
    }
  }
  
  function show_hide_copy_message_bits() {
    copy_msg_opacity = (copy_msg_opacity == 1) ? 0 : 1;
    copy_msg_g.selectAll("text")
              .transition()
              .style("opacity", copy_msg_opacity);
    copy_msg_g.selectAll("circle")
              .transition()
              .style("opacity", copy_msg_opacity);
    
    if (copy_msg_opacity == 0) {
      d3.select("#showbuttontext")
        .transition()
        .text("Show Original Messages")
    } else {
      d3.select("#showbuttontext")
        .transition()
        .text("Hide Original Messages")
    }
  }
  
  function gen_vis(res, msg_g, copy_msg_g, red_g, edge_g) {
    msg_g.selectAll("*").remove();
    copy_msg_g.selectAll("*").remove();
    red_g.selectAll("*").remove();
    edge_g.selectAll("*").remove();
    
    const bracket_msg = res[0];
    const bracket_red = res[1];
    const edge_list = res[2];
    
    msg_len = bracket_msg.length; // depending on the code selected this might change msg_len
    red_len = bracket_red.length; // depending on the code selected this might change red_len

    msg_bits = bracket_msg.map(function(d) {return 0}); // uncorrupted message bits
    console.log(msg_bits);
    red_bits = bracket_red.map(function(d) {return ""}); // uncorrupted redundancy bits
    console.log(red_bits);
    
    msg_adj = message_adjacencies(edge_list, msg_len);
    red_adj = redundancy_adjacencies(edge_list, red_len);
  
    // Add circles at the top for message bits
    var msg_circs = msg_g.selectAll("circle")
        .data(bracket_msg, d => d.i)
        .enter()
        .append("circle")
          .attr("cx", d => top_index_to_x(d,msg_len))
          .attr("cy", msg_y)
          .attr("r", radius)
          .attr("fill", "white")
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr("id", d => top_circ_id(d))
          .on("click", function(d) {
            precorruption_toggle_message_bits(d)
          });

    // Add text for the top message bits
    var msg_text = msg_g.selectAll("text")
       .data(bracket_msg.map(d => [d, msg_bits[d]]))
       .join("text")
         .attr("x", d => top_index_to_x(d[0],msg_len))
         .attr("y", msg_y)
         .attr("id", d => top_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1])
         .on("click", function(d) {
           precorruption_toggle_message_bits(d)
         });
             
    copy_msg_g.selectAll("circle")
            .data(bracket_msg)
            .enter()
            .append("circle")
              .attr("cx", d => top_index_to_x(d,msg_len))
              .attr("cy", copy_msg_y)
              .attr("r", radius)
              .attr("fill", "white")
              .attr('stroke', 'black')
              .attr('stroke-width', 2)
              //.style("opacity", copy_msg_opacity)
              .style("opacity", 0)
              .attr("id", d => copy_top_circ_id(d));
  
    copy_msg_g.selectAll("text")
            .data(bracket_msg.map(d => [d, msg_bits[d]]))
            .join("text")
              .attr("x", d => top_index_to_x(d[0],msg_len))
              .attr("y", copy_msg_y)
              .attr("id", d => copy_top_text_id(d[0]))
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              //.style("opacity", copy_msg_opacity)
              .style("opacity", 0)
              .text(d => d[1]);
    
    // Add circles at the bottom for redundancy bits
    var red_circs = red_g.selectAll("circle")
        .data(bracket_red)
        .enter()
        .append("circle")
          .attr("cx", d => bottom_index_to_x(d,red_len))
          .attr("cy", red_y)
          .attr("r", radius)
          .attr("fill", "white")
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr("id", d => bottom_circ_id(d));

    // Add text for the bottom redundancy bits
    var red_text = red_g.selectAll("text")
       .data(bracket_red.map(d => [d, red_bits[d]]))
       .join("text")
         .attr("x", d => bottom_index_to_x(d[0],red_len))
         .attr("y", red_y)
         .attr("id", d => bottom_text_id(d[0]))
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .text(d => d[1]);

    // Add edges
    var edges = edge_g.selectAll("line")
      .data(edge_list)
      .enter()
      .append("line")
          .attr("x1", d => top_index_to_x(d[0],msg_len))
          .attr("y1", msg_y + radius)
          .attr("x2", d => bottom_index_to_x(d[1],red_len))
          .attr("y2", red_y - radius)
          .attr("id", edge_id)
          .attr('stroke-width', 2)
          .style("stroke", "black")
          .style("stroke-opacity",1);
  }
  
  // Start building actual visualization...
  const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width+10, height+10]);
  // set .text(...) here to whatever you want here to see variable values
  var debug = svg.append('text')
              .attr('x', 0)
              .attr('y', 15)
              .attr("dy", ".40em")
              .text("Use .text() to print debug info here! TODO: remove in final version");

  const msg_g = svg.append('g'); // group of circles for message bits
  const copy_msg_g = svg.append('g');
  const red_g = svg.append('g'); // group of circles for redundancy bits
  const edge_g = svg.append('g'); // group for edges across
  const gbut_g = svg.append('g'); // group for graph buttons
  
  msg_g.selectAll('circle')
       .on("click", function(d) {
            precorruption_toggle_message_bits(d)
        });
  msg_g.selectAll('text')
       .on("click", function(d) {
            precorruption_toggle_message_bits(d)
        });
  
  gen_vis(res, msg_g, copy_msg_g, red_g, edge_g);
  
  const graphs = [get_duplication_code(msg_len, num_times), 
                  get_grouped_parity_check_code(msg_len, default_red_len), 
                  get_johnsonlike_code(),
                  get_grassmannlike_code(),
                  get_hadamard_code()]
  
  function change_graph(d){
    console.log(msg_len);
    console.log(red_len);
    console.log(d.srcElement.id);
    var id = d.srcElement.id
    var idx = parseInt(id.slice(4, id.length - 3));
    var res = graphs[idx]
    
    gbut_g.selectAll('rect')
          .attr('fill', 'white');
    d3.select("#gbut"+idx+"rect")
      .transition()
      .attr('fill', 'lightgreen')
    gen_vis(res, msg_g, copy_msg_g, red_g, edge_g);
  }
  
  gbut_g.selectAll('rect')
        .data(graphs, (d,i) => i)
        .enter()
        .append('rect')
          .attr('x', width - 50)
          .attr('y', (d,i) => i*60 + 165)
          .attr('width', 30)
          .attr('height', 30)
          .attr('stroke', 'black')
          .attr('stroke-width', 3)
          .attr('fill', function(d, i){
            return (i > 0) ? 'white':'lightgreen';
          })
          .attr('id', (d, i) => "gbut"+i+"rect")
          .on('click', function(d){change_graph(d);});
  
  gbut_g.selectAll('text')
        .data(graphs, (d,i) => i)
        .enter()
        .append('text')
          .attr('x', width-35)
          .attr('y', (d,i) => i*60 + 165 + 15)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr('id', (d, i) => "gbut"+i+"text")
          .text((d, i) => i)
          .on('click', function(d){change_graph(d);});

/*  const arrow_width = 10;
  const arrow_height = 10;
//  const arrow_pts = [[0, 0], [0, arrow_height], [arrow_width, arrow_height / 2]];
  const arrow_pts = [[1, 1], [1, arrow_height - 1], [arrow_width, arrow_height / 2]];
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [0, 0, arrow_width, arrow_height])
    .attr('refX', arrow_width / 2)
    .attr('refY', arrow_height / 2)
    .attr('markerWidth', arrow_width)
    .attr('markerHeight', arrow_height)
 //   .attr("fill", "white")
    .attr('orient', 'auto')
    .append('path')
    .attr('d', d3.line()(arrow_pts))
    .attr('stroke', 'black')
    .attr('stroke-width', 2); */

  /* #################### BUILDS ENCODING AND DECODING ANIMATIONS #################### */

  const button_width = 140;
  const button_height = 25;
  const button_x = 10;
  const button_y = 550;
  const show_but_x = width - 210;
  const show_but_width = 200;

  // Add button to trigger transition
  const button_g = svg.append('g');
  const show_but_g = svg.append('g');
  const corr_g = svg.append('g');

  button_g.append('rect')
          .attr('x', button_x)
          .attr('y', button_y)
          .attr('width', button_width)
          .attr('height', button_height)
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .style('fill', 'white')
          .attr("id", "buttonrect")
          .on('click', encode_animation);
    
  button_g.append('text')
          .attr('x', button_x + (button_width / 2))
          .attr('y', button_y + (button_height / 2))
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("id", "buttontext")
          .text("Encode")
          .on('click', encode_animation);

  show_but_g.append('text')
            .attr('x', show_but_x + (show_but_width / 2))
            .attr('y', button_y + (button_height / 2))
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("id", "showbuttontext")
            .text("Show Original Messages");
            
  
  show_but_g.append('rect')
            .attr('x', show_but_x)
            .attr('y', button_y)
            .attr('width', show_but_width)
            .attr('height', button_height)
            .style('stroke', 'black')
            .style('stroke-width', 3)
            .style('fill', 'white')
            .style('fill-opacity', 0)
            .attr("id", "showbuttonrect")
            .on('click', show_hide_copy_message_bits);
  
  // animation for encoding
  function encode_animation() {
    // TODO change this back; this is zero to help speedup developing the decoding part
    const duration = 10;
    const delay = 10;

    // disable all buttons during animation
    msg_g.selectAll("circle").on("click", null);
    msg_g.selectAll("text").on("click", null);
    red_g.selectAll("circle").on("click", null);
    red_g.selectAll("text").on("click", null);
    button_g.select("#buttontext").text("Encoding...").on("click", null);
    button_g.select("#buttonrect").on("click", null);

    // Add guidance text
    svg.append("text")
            .transition()
            .attr("id", "corruption_inst_txt")
            .attr("x", width-300)
            .attr("y", msg_y)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .text("")
            .transition()
            .duration(duration)
            .text("Top vertices represent message bits")
            .transition()
            .text("");
    
    svg.append("text")
            .transition()
            .delay(delay*2)
            .attr("id", "corruption_inst_txt")
            .attr("x", width-250)
            .attr("y", (red_y + msg_y)/2 )
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .text("")
            .transition()
            .duration(duration)
            .text("Edges represent neighborhood relations")
            .transition()
            .text("");
    
    svg.append("text")
            .transition()
            .delay(delay*4)
            .attr("id", "corruption_inst_txt")
            .attr("x", width/2)
            .attr("y", button_y)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .text("")
            .transition()
            .duration(duration)
            .text("Bottom vertices represent redundancy bits")
            .transition()
            .text("");

    
    for (var i = 0; i < red_len; i++) {
      // white out all nonrelevant edges
      d3.selectAll("line")
        .filter(function() { 
          var eid = d3.select(this).attr("id");
          return parseInt(eid.slice(eid.indexOf("b") + 1)) != i;
        })
        .transition()
        .duration(duration)
        .style("stroke", "#D3D3D3")
        .style("stroke-opacity",0.27)
        .delay(delay * i + delay*5 + 5*duration)
        .transition()
        .duration(duration)
        .style("stroke", "black")
        .style("stroke-opacity",1);
      
      red_bits[i] = xor_neighbors(i, red_adj, msg_bits);
      d3.select("#" + bottom_text_id(i))
        .transition()
        .text(red_bits[i])
        .delay(delay * (i + 1));
    }

    // re-enables clicking the vertices
    var clickdelay = d3.timeout(function () {
      msg_g.selectAll("circle").on("click", corruption_toggle_message_bits);
      msg_g.selectAll("text").on("click", corruption_toggle_message_bits);
      red_g.selectAll("circle").on("click", corruption_toggle_message_bits);
      red_g.selectAll("text").on("click", corruption_toggle_message_bits);
      button_g.select("#buttontext").text("Decode").on("click", decode_animation);
      button_g.select("#buttonrect").on("click", decode_animation);

      // Merge all circles to one line
      msg_g.selectAll("circle")
        .transition()
        .duration(duration)
        .style("stroke", "limegreen")
        .attr("cx", function (d) { return (d + 1) * (width / (red_len + msg_len + 1)); })
        .attr("cy", corruption_y);
      
      msg_g.selectAll("text")
        .transition()
        .duration(duration)
        .attr("x", function (d) { return (d[0] + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
      
      red_g.selectAll("circle")
          .transition()
          .duration(duration)
          .style("stroke", "dodgerblue")
          .attr("cx", function (d) { return (d + msg_len + 1) * (width / (red_len + msg_len + 1)); })
          .attr("cy", corruption_y);

      red_g.selectAll("text")
        .transition()
        .duration(duration)
        .attr("x", function (d) { return (d[0] + msg_len + 1) * (width / (red_len + msg_len + 1)); })
        .attr("y", corruption_y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

      edge_g.selectAll("line")
          .transition()
          .duration(duration)
          .style("stroke-opacity", 0);
      
      corr_g.append("text")
            .transition()
            .duration(duration)
            .attr("id", "corruption_inst_txt")
            .attr("x", width/2)
            .attr("y", corruption_y - 40)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .text("Now try to creat errors by clicking the bits.");
      
      corr_g.append("text")
            .attr("id", "corruption_msgbits_txt")
            .attr("x", (msg_len / 2) * (width / (red_len + msg_len + 1)))
            .attr("y", corruption_y + 40)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style('fill', 'limegreen')
            .text("Message Bits.");
      
      corr_g.append("text")
            .attr("id", "corruption_redbits_txt")
            .attr("x", (msg_len + red_len / 2) * (width / (red_len + msg_len + 1)))
            .attr("y", corruption_y + 40)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style('fill', 'dodgerblue')
            .text("Redundant Bits.");
      
    }, delay * (red_len + 1));
    
  }

  // animation for decoding
  function decode_animation() {
    
    const duration =1000;
    const delay = 1000;

    var changeStrokeforRedBits = {};
    var changeStrokeOpacityforRedBits = {};
    var changeFillforRedBits = {};

    var changeStrokeforMsgBits = {};
    var changeStrokeOpacityforMsgBits = {};
    var changeFillforMsgBits = {};

    var changeStrokeforEdges = {};
    var changeStrokeOpacityforEdges = {};
    var changeFillforEdges = {};
    
    
    corr_g.selectAll("text").remove();

    // move all the circles and lines back
    msg_g.selectAll("circle")
      .transition()
      .duration(duration)
      .style("stroke", "black")
      .attr("cx", d => top_index_to_x(d,msg_len))
      .attr("cy", msg_y);
    
    msg_g.selectAll("text")
      .transition()
      .duration(duration)
      .attr("x", d => top_index_to_x(d[0], msg_len))
      .attr("y", msg_y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");
    
    red_g.selectAll("circle")
      .transition()
      .duration(duration)
      .style("stroke", "black")
      .attr("cx", d => bottom_index_to_x(d, red_len))
      .attr("cy", red_y); 
    
    red_g.selectAll("text")
      .transition()
      .duration(duration)
      .attr("x", d => bottom_index_to_x(d[0], red_len))
      .attr("y", red_y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");
    
    edge_g.selectAll("line")
      .transition()
      .duration(duration)
      .style("stroke-opacity", 1);

    var corrupted_msg = read_msg_bits_from_circles();
    var corrupted_red = read_red_bits_from_circles();
    var transcript = majority_decoding(msg_adj, red_adj, corrupted_msg, corrupted_red);

    // disable all buttons during animation
    msg_g.selectAll("circle").on("click", null);
    msg_g.selectAll("text").on("click", null);
    red_g.selectAll("circle").on("click", null);
    red_g.selectAll("text").on("click", null);
    button_g.select("#buttontext").text("Decoding...").on("click", null);
    button_g.select("#buttonrect").on("click", null);
    
    const deg = msg_adj[0].length;
    var t;
    var delayforvotecount = new Array(transcript.length);

    var animationdelay = d3.timeout(function () {
      for (t = 0; t < transcript.length - 1; t++) {
        var msg_idx = transcript[t][0];
        var maj_vote = transcript[t][1];
        var neighbors = transcript[t][2];
        var votes = transcript[t][3];
  
        // Step 1+2: highlight message bit and its neighbors and show the vote calc
        msg_g.selectAll("circle")
            .call(StrokeforMsgBits, msg_idx, duration*deg, delay*t*deg, "grey", "black")
            .call(StrokeOpacityforMsgBits, msg_idx, duration*deg, delay*t*deg, 0.27, 1);
            //.call(FillforMsgBits, msg_idx, duration, delay*t*deg, delay, "lightblue", "white");

        red_g.selectAll("circle")
            .call(StrokeforRedBits, msg_idx, duration*deg, delay*t*deg, "grey", "black")
            .call(StrokeOpacityforRedBits, msg_idx, duration*deg, delay*t*deg, 0.27, 1)
            .call(FillforRedBits, msg_idx, duration, delay*t*deg, delay, "lightblue", "white");
          

        edge_g.selectAll("line")
            .call(StrokeforEdges, msg_idx, duration*deg, delay*t*deg)
            .call(StrokeOpacityforEdges, msg_idx, duration*deg, delay*t*deg);
        
      
       // Step 2: for each neighboring redundancy bit, move neighbor message bits down to the redundancy bit to represent xor
        // TODO
         /*for (var j = 0; j < neighbors.length; j++) {
            var red_idx = neighbors[j];
            red_g.selectAll("circle")
              .call(FillforRedBits, red_idx, msg_idx, duration, delay*t*deg + delay*j, "lightblue", "white");
          
            msg_g.selectAll("circle")
              .call(FillforMsgBits, red_idx, msg_idx, duration, delay*t*deg + delay*j, "lightblue", "white");

            }*/
              /*.filter(function() { 
                var id = d3.select(this).attr("id");
                var idx = parseInt(id.slice(1, id.length - 3));
                return red_neighbors.includes(idx) && (idx != msg_idx);
              })
              .transition()
              .duration(duration)
              .attr("fill", "lightblue")
              .delay(delay * j)
              .transition()
              .duration(duration)
              .attr("fill", "white");*/
            

      msg_g.select("#" + top_text_id(msg_idx))
          .transition()
          .duration(duration)
          .text(maj_vote)
          .delay(delay * (t+1) * deg); 
        
        // Step 3: make vote move up from redundancy bit to the starting message bit
      }
    }, delay) ; 

    
    

    // re-enables clicking the vertices
    // TODO: change bits back to original bits
    var clickdelay = d3.timeout(function () {
      msg_g.selectAll("circle").on("click", precorruption_toggle_message_bits);
      msg_g.selectAll("text").on("click", precorruption_toggle_message_bits);
      red_g.selectAll("circle").on("click", precorruption_toggle_message_bits);
      red_g.selectAll("text").on("click", precorruption_toggle_message_bits);
      button_g.select("#buttontext").text("Encode").on("click", encode_animation);
      button_g.select("#buttonrect").on("click", encode_animation);

      debug.text(transcript[transcript.length - 1]);
      if (transcript[transcript.length - 1]) {
        for (var i = 0; i < msg_len; i++) {
          var cur_displayed_bit = parseInt(msg_g.select("#" + top_text_id(i)).text());
          if (cur_displayed_bit != msg_bits[i]) {
          //  debug.text("Too many corruptions!"); // TODO: instead of debug add an actual textbox for this
          }
        }
      }
    }, delay * transcript.length);

    function StrokeforMsgBits(circle, msg_idx, duration, delay, color1, color2) {
           d3.select(changeStrokeforMsgBits)
            .transition()
            .duration(duration)
            .tween("style:stroke", function() {
              return circle.style("stroke", function () {
                var id = d3.select(this).attr("id");
                return id != top_circ_id(msg_idx) ? color1 : color2;})
            })
            .delay(delay);
         }

     function StrokeOpacityforMsgBits(circle, msg_idx, duration, delay, opac1, opac2) {
          d3.select(changeStrokeOpacityforMsgBits)
            .transition()
            .duration(duration)
            .tween("style:stroke-opacity", function() {
              return circle.style("stroke-opacity", function () {
                var id = d3.select(this).attr("id");
                return id != top_circ_id(msg_idx) ? opac1 : opac2;})
            })
            .delay(delay);
         } 

    /*function FillforMsgBits (circle, red_idx, msg_idx, duration, outerdelay, innerdelay, color1, color2) {
              var msg_neighbors = msg_adj[msg_idx];
              var red_neighbors = red_adj[red_idx];
              d3.select(changeFillforMsgBits)
                .transition()
                .duration(duration)
                .tween("style:fill", function() {
                  return circle.style("fill", function() {
                    var id = d3.select(this).attr("id");
                    var idx = textcirc_id_to_idx(id);
                    return (red_neighbors.includes(idx) && (idx != msg_idx)) ? color1 : color2;})
                  })
                .delay(delay);
              }*/

    function StrokeforRedBits(circle, msg_idx, duration, delay, color1, color2) {
           var neighbors = msg_adj[msg_idx];
           d3.select(changeStrokeforRedBits)
            .transition()
            .duration(duration)
            .tween("style:stroke", function() {
              return circle.style("stroke", function() {
                var id = d3.select(this).attr("id");
                var idx = textcirc_id_to_idx(id);
                return !neighbors.includes(idx) ? color1 :  color2; })
            })
            .delay(delay);
         }
        
    function StrokeOpacityforRedBits(circle, msg_idx, duration, delay, opac1, opac2) {
          var neighbors = msg_adj[msg_idx];
          d3.select(changeStrokeOpacityforRedBits)
            .transition()
            .duration(duration)
            .tween("style:stroke-opacity", function() {
              return circle.style("stroke-opacity", function() {
                var id = d3.select(this).attr("id");
                var idx = textcirc_id_to_idx(id);
                return !neighbors.includes(idx) ? opac1 : opac2; })
            })
            .delay(delay);
        }

    function FillforRedBits (circle, msg_idx, duration, outerdelay, innerdelay, color1, color2) {
          //var red_id = d3.select(this).attr("id");
          var msg_neighbors = msg_adj[msg_idx];
          d3.select(changeFillforRedBits)
            .transition()
            .duration(duration)
            .tween("style:fill", function() {
              return circle.style("fill", function() {
              var id = d3.select(this).attr("id");
              var idx = textcirc_id_to_idx(id);
              return msg_neighbors.includes(idx) ? color1 : color2; })
            })
            .delay(function(d, i){ 
              console.log(i);
              //return i;
              //var id = getAttr(circle);
              //console.log("blahblahblah");
              //console.log(id);
              //var id = d3.select(this).attr("id");
              //console.log(id);
              //var idx = textcirc_id_to_idx(id);
              //if (msg_neighbors.includes(idx)) {
              if (msg_neighbors.includes(i)) {
                //return outerdelay + innerdelay*(msg_neighbors.indexOf(idx))
                return outerdelay + innerdelay*(msg_neighbors.indexOf(i))
              }
              else{
                return outerdelay
              }
            });
        }

    function StrokeforEdges(path, msg_idx,duration,delay) {
      d3.select(changeStrokeforEdges)
            .transition()
            .duration(duration)
            .tween("style:stroke", function() {
              return path.style("stroke", function () {
                var id = d3.select(this).attr("id");
                return parseInt(id.slice(id.indexOf("t") + 1)) != msg_idx ? "#D3D3D3": "black";});
            })
            .delay(delay);
      
    }

    function StrokeOpacityforEdges(path, msg_idx, duration, delay) {
      d3.select(changeStrokeOpacityforEdges)
            .transition()
            .duration(duration)
            .tween("style:stroke-opacity", function() {
              return path.style("stroke-opacity", function () {
                var id = d3.select(this).attr("id");
                return parseInt(id.slice(id.indexOf("t") + 1)) != msg_idx ? 0.27: 1;});
            })
            .delay(delay);
      
    }

    function getAttr(circle) {
                return circle.attr("id", function (){
                  return d3.select(this).attr("id"); 
                });
              }
  }

  

  function read_msg_bits_from_circles() {
    var res = new Array(msg_len);
    for (var i = 0; i < msg_len; i++) {
      res[i] = parseInt(msg_g.select("#" + top_text_id(i)).text());
    }
    return res;
  }

  function read_red_bits_from_circles() {
    var res = new Array(red_len);
    for (var i = 0; i < red_len; i++) {
      res[i] = parseInt(red_g.select("#" + bottom_text_id(i)).text());
    }
    return res;
  }

  return svg.node();
}


function _arrow_try(d3)
{
  const width = 1200;
  const height = 600;

  const x1 = 400;
  const y1 = 100;
  const x2 = 100;
  const y2 = 500;

  const theta = 30*3.14/180;

  var line_length = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  var arrow_length = line_length*0.05;
/* 
  var arrow_left_x = 0.05*(-Math.abs(x1-x2)*Math.cos(theta) + Math.abs(y1-y2)*Math.sin(theta));
  var arrow_left_y = 0.05*(-Math.abs(y1-y2)*Math.cos(theta) - Math.abs(x1-x2)*Math.sin(theta));
  var arrow_right_x = 0.05*(-Math.abs(x1-x2)*Math.cos(theta) - Math.abs(y1-y2)*Math.sin(theta));
  var arrow_right_y = 0.05*(-Math.abs(y1-y2)*Math.cos(theta) + Math.abs(y1-y2)*Math.sin(theta));

  var arrow_left_x = 0.05*(Math.abs(x1-x2)*Math.cos(theta) - Math.abs(y1-y2)*Math.sin(theta));
  var arrow_left_y = 0.05*(Math.abs(y1-y2)*Math.cos(theta) + Math.abs(x1-x2)*Math.sin(theta));
  var arrow_right_x = 0.05*(Math.abs(x1-x2)*Math.cos(theta) + Math.abs(y1-y2)*Math.sin(theta));
  var arrow_right_y = 0.05*(Math.abs(y1-y2)*Math.cos(theta) - Math.abs(y1-y2)*Math.sin(theta)); */

  var arrow_left_x = 0.05*((x1-x2)*Math.cos(theta) + (y2-y1)*Math.sin(theta));
  var arrow_left_y = 0.05*((y2-y1)*Math.cos(theta) - (x1-x2)*Math.sin(theta));
  var arrow_right_x = 0.05*((x1-x2)*Math.cos(theta) - (y2-y1)*Math.sin(theta));
  var arrow_right_y = 0.05*((y2-y1)*Math.cos(theta) + (x1-x2)*Math.sin(theta));

  
  const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width+10, height+10]);
  
  const edge_g = svg.append('g'); // group for edges across

  var edges = edge_g.append("line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2)
          .style('stroke-width', 2)
          .style("stroke", "black")
          .style("stroke-opacity",1);
  
  var triangle_arrow_start = d3.path();
  var triangle_arrow_end = d3.path();
  
  triangle_arrow_start
          .moveTo(x2 - arrow_left_x, y2 + arrow_left_y);
  
  triangle_arrow_start
          .lineTo(x2,y2);
  
  triangle_arrow_start
          .lineTo(x2 - arrow_right_x, y2 + arrow_right_y);
  
  triangle_arrow_start.closePath();

  triangle_arrow_end
          .moveTo(x1 - arrow_left_x, y1 + arrow_left_y);
  
  triangle_arrow_end
          .lineTo(x1,y1);
  
  triangle_arrow_end
          .lineTo(x1 - arrow_right_x, y1 + arrow_right_y);
  
  triangle_arrow_end.closePath();
  
  edge_g.append("path")
        .attr("d",triangle_arrow_start)
        .style('stroke-width', 2)
        .style("stroke", "black")
        .style("fill","white")
        .transition()
        .duration(1000)
        .attr("d",triangle_arrow_end)
        .delay(1000);
  
  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("gen_vis_guid")).define("gen_vis_guid", ["d3","get_duplication_code","message_adjacencies","redundancy_adjacencies","top_index_to_x","top_circ_id","top_text_id","bottom_index_to_x","bottom_circ_id","bottom_text_id","edge_id"], _gen_vis_guid);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("bipartite_graph_2")).define("bipartite_graph_2", ["get_duplication_code","get_vote","majority","message_adjacencies","redundancy_adjacencies","top_text_id","d3","textcirc_id_to_idx","top_circ_id","bottom_text_id","bottom_circ_id","top_index_to_x","bottom_index_to_x","edge_id","mkTriangle","redtovote_edge_id","vote_box_id","vote_text_id","get_grouped_parity_check_code","get_complete_code","get_fano_code","xor_neighbors"], _bipartite_graph_2);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("bipartite_graph_text")).define("bipartite_graph_text", ["get_duplication_code","get_vote","majority","message_adjacencies","redundancy_adjacencies","top_text_id","copy_top_text_id","d3","textcirc_id_to_idx","top_circ_id","bottom_text_id","bottom_circ_id","top_index_to_x","copy_top_circ_id","bottom_index_to_x","edge_id","mkTriangle","get_grouped_parity_check_code","get_johnsonlike_code","get_grassmannlike_code","get_hadamard_code","xor_neighbors"], _bipartite_graph_text);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("preset_graphs")).define("preset_graphs", _preset_graphs);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("get_grouped_parity_check_code")).define("get_grouped_parity_check_code", ["bracket_n"], _get_grouped_parity_check_code);
  main.variable(observer("get_duplication_code")).define("get_duplication_code", ["bracket_n","get_duplication_edges"], _get_duplication_code);
  main.variable(observer("get_johnsonlike_code")).define("get_johnsonlike_code", ["bracket_n"], _get_johnsonlike_code);
  main.variable(observer("get_complete_code")).define("get_complete_code", ["bracket_n","bipartite_graph_from_hypergraph"], _get_complete_code);
  main.variable(observer("get_fano_code")).define("get_fano_code", ["bracket_n","bipartite_graph_from_hypergraph"], _get_fano_code);
  main.variable(observer("get_grassmannlike_code")).define("get_grassmannlike_code", ["bracket_n","bipartite_graph_from_hypergraph"], _get_grassmannlike_code);
  main.variable(observer("bipartite_graph_from_hypergraph")).define("bipartite_graph_from_hypergraph", _bipartite_graph_from_hypergraph);
  main.variable(observer("get_hadamard_code")).define("get_hadamard_code", ["bracket_n"], _get_hadamard_code);
  main.variable(observer("top_index_to_x")).define("top_index_to_x", _top_index_to_x);
  main.variable(observer("bottom_index_to_x")).define("bottom_index_to_x", _bottom_index_to_x);
  main.variable(observer("bracket_n")).define("bracket_n", _bracket_n);
  main.variable(observer("top_circ_id")).define("top_circ_id", _top_circ_id);
  main.variable(observer("bottom_circ_id")).define("bottom_circ_id", _bottom_circ_id);
  main.variable(observer("redtovote_edge_id")).define("redtovote_edge_id", _redtovote_edge_id);
  main.variable(observer("vote_box_id")).define("vote_box_id", _vote_box_id);
  main.variable(observer("vote_text_id")).define("vote_text_id", _vote_text_id);
  main.variable(observer("top_text_id")).define("top_text_id", _top_text_id);
  main.variable(observer("bottom_text_id")).define("bottom_text_id", _bottom_text_id);
  main.variable(observer("copy_top_circ_id")).define("copy_top_circ_id", _copy_top_circ_id);
  main.variable(observer("copy_top_text_id")).define("copy_top_text_id", _copy_top_text_id);
  main.variable(observer("textcirc_id_to_idx")).define("textcirc_id_to_idx", _textcirc_id_to_idx);
  main.variable(observer("edge_id")).define("edge_id", _edge_id);
  main.variable(observer("message_adjacencies")).define("message_adjacencies", _message_adjacencies);
  main.variable(observer("redundancy_adjacencies")).define("redundancy_adjacencies", _redundancy_adjacencies);
  main.variable(observer("xor_neighbors")).define("xor_neighbors", _xor_neighbors);
  main.variable(observer("majority")).define("majority", _majority);
  main.variable(observer("get_vote")).define("get_vote", _get_vote);
  main.variable(observer("get_duplication_edges")).define("get_duplication_edges", _get_duplication_edges);
  main.variable(observer("precorruption_toggle_message_bits")).define("precorruption_toggle_message_bits", ["d3","top_text_id","bottom_text_id"], _precorruption_toggle_message_bits);
  main.variable(observer("mkTriangle")).define("mkTriangle", ["d3"], _mkTriangle);
  main.variable(observer("bipartite_graph")).define("bipartite_graph", ["get_duplication_code","get_vote","majority","message_adjacencies","redundancy_adjacencies","d3","top_text_id","copy_top_text_id","bottom_text_id","top_circ_id","bottom_circ_id","top_index_to_x","copy_top_circ_id","bottom_index_to_x","edge_id","get_grouped_parity_check_code","get_johnsonlike_code","get_grassmannlike_code","get_hadamard_code","xor_neighbors","textcirc_id_to_idx"], _bipartite_graph);
  main.variable(observer("arrow_try")).define("arrow_try", ["d3"], _arrow_try);
  return main;
}
