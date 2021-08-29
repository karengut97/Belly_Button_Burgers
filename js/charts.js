function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    //console.log(metadata[0]);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    var result = resultArray[0];
    
    //console.log("First result in metadata");
    //console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // PANEL.append("h6").text("ID: " + result.id);
    // PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
    // PANEL.append("h6").text("GENDER: " + result.gender);
    // PANEL.append("h6").text("AGE: " + result.age);
    // PANEL.append("h6").text("LOCATION: " + result.location);
    // PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    // PANEL.append("h6").text("WFREQ: " + result.wfreq);

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
    console.log(data);
   
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log("These are filteredSamples" + filteredSamples);
    
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];
    console.log("This is my sample in buildCharts");
    console.log(firstSample);
    
    var metadata = data.metadata;
    // console.log("this is the data.metadata result");
    // console.log(metadata);
    // console.log("This is the first element in my metadata");
    // console.log(metadata[0]);
    // console.log("this is the washing in my first metadata");
    // console.log(metadata[0].wfreq);

    filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
    firstMetadata = filteredMetadata[0];
    // console.log("This is my filtered metadata");
    // console.log(firstMetadata);
     
    var washes = parseFloat(firstMetadata.wfreq).toFixed(2);
    console.log("this is my wash freq");
    console.log(washes);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    var sampleValuesOrdered = sampleValues.slice(0, 10).reverse();
    
    //console.log(otuIds);
    //.log(otuLabels);
    //console.log(sampleValues);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barTrace = [{
      x: sampleValuesOrdered,
      y: yticks,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    }];
  //   // 9. Create the layout for the bar chart. 
    var barLayout = {      
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "IDs"},
      titlefont: {"size": 24},
    };
    
      // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barTrace, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Electric"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      titlefont: { size: 24},
      xaxis: {title: "OTU ID",
      margin:{
        l: 50,
        r: 50,
        t: 100,
        b: 100,
        pad: 4
      },
      hovermode: "closest"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

     // 4. Create the trace for the gauge chart.
     var gaugeData = [{
       value: washes,
       title: {text: "Scrubs per Week", font: {size: 15}},
       type: "indicator",
       mode: "gauge+number",
       gauge:{
        axis: {range: [null, 10]},
        bar: { color: "darkblue"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "green"}
       ]},
     }     
    ];
    
    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "Belly Button Washing Frequency",
     titlefont: {"size": 24},
     margin: {
       b: 200
     }
     };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
