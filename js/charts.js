function init() {
  // Grab a reference to the dropdown select element
  console.log("init function called...");
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("js/samples.json").then((data) => {
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

// // Initialize the dashboard
console.log("calling init function")
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log("Printing Metadata REsult");
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      console.log("Iterating through k,v of metadata result");
      console.log(key, value);
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  console.log("buildCharts function called...");
  d3.json("js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log("samples array: ");
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("filtered samples array: ");
    console.log(resultArray);

    
    // DELIVERABLE 3 SECTION #################
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metaArray[0];
    console.log("DELV 3 result obj from metadata: ");
    console.log(metaResult);
  
    // 3. Create a variable that holds the washing frequency.
    var washingFreq = metaResult.wfreq;
    console.log("Washing Frequency:");
    console.log(washingFreq);


    // END DELIVERABLE 3 SECTION #############



    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("First sample in the array: ");
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_idsArray = result.otu_ids;
    console.log("otu_ids: ");
    console.log(otu_idsArray);

    let otu_labelsArray = result.otu_labels;
    console.log("otu_labels: ");
    console.log(otu_labelsArray);

    let sample_valuesArray = result.sample_values;
    console.log("sample_valuesArray: ");
    console.log(sample_valuesArray);



    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var topSampleValues = sample_valuesArray.slice(0,10);
    console.log("Top Sample_values: ");
    console.log(topSampleValues);

    // var yticks = otu_idsArray.slice(0,10);
    var topTen = result.sample_values.slice(0,10);
    console.log("topTen");
    console.log(topTen);

    var topTen_otu_ids = result.otu_ids.slice(0,10);
    console.log("topTen otu ids");
    console.log(topTen_otu_ids);
    
    var topTen_otu_labels = result.otu_labels.slice(0,10);
    console.log("topTen OTU labels");
    console.log(topTen_otu_labels);

    // var yticks = result.sample_values.slice(0,10).reverse().map(val => result.otu_ids.toString());
    var yticks = topTen_otu_ids.map(id => {
      return String("OTU " + id);
    });
    console.log("printing yticks:");
    console.log(yticks);

    // // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: topTen.reverse(),
      y: yticks.reverse(),
      text: topTen_otu_labels.reverse(),
      name: "Samples",
      type: "bar",
      orientation: "h"
    };

    var barData = [trace1];



    // // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "Top Ten Bacteria Cultures Found"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otu_idsArray,
      y: sample_valuesArray,
      text: otu_labelsArray,
      mode: 'markers',
      marker: {
        size: sample_valuesArray,
        color: otu_idsArray,
        colorscale: 'Portland'
      }

    }


    var bubbleData = [
      trace2
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU IDs"},
      hovermode: 'closest'
      // margin: {
      //   l: 50,
      //   r: 50,
      //   b: 100,
      //   t: 100,
      //   pad: 4
      // }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // DELIVERABLE 3 SECTION ######
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
       {
         type: "indicator",
         mode: "gauge+number",
         value: washingFreq,
         title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week'},
        //  delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
         gauge: {
           axis: { range: [null, 10]},
           bar: { color: "black" },
          //  bgcolor: "white",
          //  borderwidth: 2,
          //  bordercolor: "gray",
           steps: [
             { range: [0, 2], color: "red" },
             { range: [2, 4], color: "orange" },
             { range: [4, 6], color: "yellow" },
             { range: [6, 8], color: "limegreen" },
             { range: [8, 10], color: "green" },
             ],

        //  threshold: {
        //    line: { color: "red", width: 4 },
        //    thickness: 0.75,
        //    value: 490
        //   }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    
  });
}
// Initialize the dashboard
// init();