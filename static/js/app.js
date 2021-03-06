function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    /* data route */
  var metadataurl =  `/metadata/${sample}`;
     
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadataurl).then((sample) => {  
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata_sample = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    metadata_sample.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(([key, value]) => {
      var row = metadata_sample.append('p');
      row.text(`${key}: ${value}`);
        
  });
    }    
  )};
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {
  /* data route */
  var sampleurl = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sampleurl).then((data) => {

  

    // @TODO: Build a Bubble Chart using the sample data
    var xvalues = data.otu_ids;
    var yvalues = data.sample_values;
    var sizes = data.sample_values;
    var colors = data.otu_ids;
    var labels = data.otu_labels;

    var trace1 = {
      x: xvalues,
      y: yvalues,
      text: labels,
      mode: 'markers',
      marker: {
        size:sizes, 
        color:colors,
        line: {
          color: 'black',
          width: 1.5
        }},
      type: "bubble"
    };
    
    

    var data = [trace1];

    var layout = {
      title: 'OTU ID',
      showlegend: false,
      height: 650,
      width: 1300
    };

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(sampleurl).then((data) => {
      var pievalue = data.sample_values.slice(0, 10);
      var pielabel = data.otu_ids.slice(0,10);
      var minilabel = data.otu_labels.slice(0,10);
      var data = [{
        type: "pie",
        pull: [0.1, 0.1, 0.1, 0.1, 0.1],
        marker: {
          line: {
          color: 'black',
          width: 1.5
        }},
        values: pievalue,
        labels: pielabel,
        hovertext: minilabel,
        }];
    
      var layout = {
      height: 600,
      width: 800
      };
    
    Plotly.newPlot('pie', data, layout);
    })
  
    });
  }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
