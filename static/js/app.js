
var $buttonYear = Plotly.d3.select("#buttonYear"); 
var $buttonState = Plotly.d3.select("#buttonState");

function BuildDropdown() {
  // Get data from '/names' endpoint
  
  url =  "/year"
  Plotly.d3.json(url, function(error, response) {
      console.log(response)
      $buttonYear.on('change', optionChanged);

      // Add options to dropdown
      var options = $buttonYear 
          .selectAll('option')
          .data(response).enter()
          .append('option')
              .text(d => d);
      
      // Add a blank option at the top.
      var $ddBlank = $buttonYear.insert("option", ":first-child")
          .text("Select...").attr("value", "").attr("selected", true);
      });
}

function optionChanged() {
  
  selectedYear = Plotly.d3.select('#buttonYear').property('value');

  if (document.getElementById('map').innerHTML = "<div id='map'></div>"){
    buildMap(selectedYear);
  };
  
  
  BuildPie(selectedYear);
};

function BuildDropdown2() {
  
  url =  "/state"
  Plotly.d3.json(url, function(error, response) {
      // console.log(response);

      // On select of new sample, add data to the array and chart
      $buttonState.on('change', optionChanged2);

      // Add options to dropdown
      var options2 = $buttonState
          .selectAll('option')
          .data(response).enter()
          .append('option')
              .text(d => d);
      
      // Add a blank option at the top.
      var $ddBlank = $buttonState.insert("option", ":first-child")
          .text("Select...").attr("value", "").attr("selected", true);
      });
}

function optionChanged2() {
  
  selectedState = Plotly.d3.select('#buttonState').property('value');

  updateBarChart(selectedState);
  updatetable1(selectedState);
};

BuildDropdown();

BuildDropdown2();


function buildMap(year) {
    
    url = '/map/' + year;
    
    d3.json(url , function(error, data) {
    
        console.log(data);
    
        var regulerTag = [];
        var cityDeath = [];
    
        for (var i = 0; i < data.length; i++) {
        
        var lat = data[i].Latitude;
        var lng = data[i].Longitude;
        var coord = [lat, lng];
        var Injur = data[i].Injuries;
        var death = data[i].Death;

        
        
        var Deathproperties = (death === 0 && Injur === 0) ? "-" : death;
        var Injurproperties = (death === 0 && Injur === 0) ? "-" : Injur ;

        
    
        var schoolName = data[i].School_Name;
        var city = data[i].Location;
    
        var states = data[i].State;
    
        var day = data[i].Date;
    
        regulerTag.push(L.marker(coord).bindPopup(`<div>State: ${states}</div><div>City: ${city}</div>
        <div>Day:  ${day}</div><div>School Name:  ${schoolName}</div><div>Death:  ${Deathproperties}</div><div>Injuries:  ${Injurproperties}</div>`));
    
        cityDeath.push(L.circle(coord, {
                                stroke: false,
                                fillOpacity: 0.75,
                                color: "red",
                                fillColor: "red",
                                radius: (parseInt(death) + parseInt(Injur))*20000 + 150000
                            }).bindPopup(`<div>School Name:  ${schoolName}</div><div>Death:  ${Deathproperties}</div><div>Injuries:  ${Injurproperties}</div>`)
                            );
        
        };
    
        console.log('regulerTag',regulerTag);
        console.log('regulerTag',cityDeath);

        function leafletmap(regulerTag, cityDeath) {

            
                var street= L.tileLayer(
                    "https://api.mapbox.com/styles/v1/laifubaobao/cjievxgd004dg2rqkm60xcqez/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGFpZnViYW9iYW8iLCJhIjoiY2poOW14b2wwMGVkcTNkbXNmbm56dG52cCJ9.DIVyJNQunpQSpP5tjiVfvA"
                ); 
                var darkmap = L.tileLayer(
                    "https://api.mapbox.com/styles/v1/laifubaobao/cjievee0r020g2st8leg30771/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGFpZnViYW9iYW8iLCJhIjoiY2poOW14b2wwMGVkcTNkbXNmbm56dG52cCJ9.DIVyJNQunpQSpP5tjiVfvA"
                            );

                var baseMaps = {
                "streetView" : street,
                "DarkMap" : darkmap
            };

                var city = L.layerGroup(regulerTag);
                var circleDeath = L.layerGroup(cityDeath);

                var overlayMaps = {
                    "City" : city,
                    "Death": circleDeath
                };

                
                var myMap = L.map("map", {
                    center: [41.8781, -87.6298],
                        zoom: 3.5,
                        layers: [darkmap, city]
                    });


                L.control.layers(baseMaps, overlayMaps).addTo(myMap);

        };

        // before initialize the map, check ifs the container is already there
        var container = L.DomUtil.get('map');
            if(container != null){
                container._leaflet_id = null;
            }
        
        leafletmap(regulerTag, cityDeath);
        
});
};

    

// build pie chart

function BuildPie(year) {
        
        url = '/map/' + year;
       
            console.log(url)

            // --------------------------------------------get data----------------------------------------------
            var stateLst = [];
            var cityLabel = [];
            var SchoolTick = [];

            

            d3.json(url , function(error, data) {

            console.log(data);

            if (error) return console.warn(error);

            for (var i = 0; i < data.length; i++) {
                
                schoolName = data[i].School_Name;
                city = data[i].Location;
                // console.log(city);
                states = data[i].State;
                // console.log(states);
                stateLst.push(states);
                cityLabel.push(city);
                SchoolTick.push(schoolName);
            };

            var counts = {};
            for (var i = 0; i < stateLst.length; i++) {
                counts[stateLst[i]] = 1 + (counts[stateLst[i]] || 0);
            }

            console.log('counts: ', counts);

            // sort top 10 :

            var sortable=[];
            for(var key in counts)
                if(counts.hasOwnProperty(key))
                    sortable.push([key, counts[key]]); // each item is an array in format [key, value]
            
            // sort items by value
            sortable.sort(function(a, b)
            {
            return b[1]-a[1]; // compare numbers
            });
            
            var Top10List = sortable.slice(0,10);
            console.log('sort',Top10List); 


            var total = 0;
            var each_value = [];
            var label = [];
            Object.entries(counts).forEach(([key, val]) => {
                total += val;
            });
            console.log('total: ', total);
            
            for(var j = 0; j < Top10List.length; j++ ){
                label.push(Top10List[j][0]);
                each_value.push(Top10List[j][1])
            }

            console.log("label", label);
            console.log("each_value", each_value);

            var data = [{
                values: each_value,
                labels: label,
                type: 'pie'
            }];

            var layout = {
                title: `Top 10 State with Most Shooting in ${year}`,
                
                
              };

              var options = {
                scrollZoom: false,
                showLink: false,
                modeBarButtonsToRemove: [
                    'sendDataToCloud',
                    'zoom2d',
                    'pan',
                    'pan2d',
                    'autoScale2d',
                    'lasso2d',
                    'autoScale2d',
                    'resetScale2d',
                    'toggleSpikelines',
                    'dragmode'
                ]
            };

            Plotly.newPlot('pie', data, layout, options);

            });


        };

function getRandomColor() {
var letters = '0123456789ABCDEF';
var color = '#';
for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
}
return color;
};

// build a line Chart

function updateBarChart(state){

    
    url = '/type/' + state;
        
            console.log(url);
    
            d3.json(url , function(error, data) {
    
                console.log(data)
                var BarY = [];
                var BarX = Object.keys(data);
                var TextLst = Object.values(data);
                console.log(BarX);
                console.log(TextLst);
    
                for (var i = 0; i < TextLst.length; i++){
                   BarY.push(TextLst[i].length);
                }
                
                var colors = getRandomColor();
                
                var trace1 = {
                    x: BarX,
                    y: BarY,
                    type: 'bar',
                    opacity: 0.8,
                    marker: {
                        color: colors
                    }
                    };
                    
                    var data = [trace1];
                    
                    var layout = {
                    title: `Shooting in School Types (${state})`,
                    showlegend: false,
                
                    };
                    
                    Plotly.newPlot('bar', data, layout);

                    
            
    
            
            });
    
    };

//http://bl.ocks.org/yan2014/c9dd6919658991d33b87
function updatetable1(state){

        
        url =  '/table1/' + state;

        console.log("table", url);

        d3.json(url, function (error,data) {

            var columns = []
            for(var key in data[0])
                        if(data[0].hasOwnProperty(key))
                            columns.push(key);

            function tabulate(data, columns) {
                var table = d3.select('#table').append('table')
                var thead = table.append('thead')
                var	tbody = table.append('tbody');
        
                // append the header row
                thead.append('tr')
                    .selectAll('th')
                    .data(columns).enter()
                    .append('th')
                    .text(function (column) { return column; });
        
                // create a row for each object in the data
                var rows = tbody.selectAll('tr')
                    .data(data)
                    .enter()
                    .append('tr');
        
                // create a cell in each row for each column
                var cells = rows.selectAll('td')
                    .data(function (row) {
                    return columns.map(function (column) {
                        return {column: column, value: row[column]};
                    });
                    })
                    .enter()
                    .append('td')
                    .text(function (d) { return d.value; });
        
                return table;
            }

            if (d3.selectAll("table").html(null)) {
                console.log('running')
                   // render the table(s)
             tabulate(data, columns); 
     
             
             };
             
        });

};


// /////////////////////////////////////////table/////////////////////////////////////////////

function tabulate(data, columns) {
    var table = d3.select('#table').append('table');
    table.attr("class", "table table-striped table-dark");
    table.attr("id", "myTable");
    var thead = table.append('thead');
    var	tbody = table.append('tbody');
  
    // append the header row
    // thead.append('tr')
    // .attr("class", "headerRow")
    //   .selectAll('th')
    //   .data(columns).enter()
    //   .append('th')
    //   .attr('scope', "col")
    //     .text(function (column) { return column; });
  
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');
  
    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[column]};
        });
      })
      .enter()
      .append('td')
        .text(function (d) { return d.value; });
  
    return table;
  };

d3.json('/table2',  function(error, dataSet) {
    // alert(error)
    console.log(dataSet); 
    // render the tables
    tabulate(dataSet, ['Date', 'Death', 'Injuries',  'Location',  'School_Name', 'School_Type', "State"]);

  });


  
  function mySearch() {
    // Declare variables 
    var input1, input2, input3, input4 ;
    var filter1, filter2, filter3, filter4, table, tr, td, i;
    var found1, found2, found3, found4;
    input1 = document.getElementById("search1");
    filter1 = input1.value.toUpperCase();
    input2 = document.getElementById("search2");
    filter2 = input2.value.toUpperCase();
    input3 = document.getElementById("search3");
    filter3 = input3.value.toUpperCase();
    input4 = document.getElementById("search4");
    filter4 = input4.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
  
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      found1 = true;
      found2 = true;
      found3 = true;
      found4 = true;
    
      if (td) {
        
        if (filter1) {
          if (td[0].innerHTML.toUpperCase().indexOf(filter1) > -1) {
            found1 = true;} else {
              found1 = false;
            }
        }
        if (filter2) {
          if (td[5].innerHTML.toUpperCase().indexOf(filter2) > -1) {
            found2 = true;} else {
              found2 = false;
            }
        }
        if (filter3) {
          if (td[6].innerHTML.toUpperCase().indexOf(filter3) > -1) {
            found3 = true;} else {
              found3 = false;
            }
        }

        if (filter4) {
          if (td[4].innerHTML.toUpperCase().indexOf(filter4) > -1) {
            found4 = true;} else {
              found4 = false;
            }
        }
        
        if (found1 && found2 && found3 && found4 ) {
          tr[i].style.display = "";
  
        }	else {
          tr[i].style.display = "none";
        }
       
    }
  }
  };



  var $table = $('table#myTable'),
  $bodyCells = $table.find('tbody tr:first').children(),
  colWidth;

  // Adjust the width of thead cells when window resizes
  $(window).resize(function() {
      // Get the tbody columns width array
      colWidth = $bodyCells.map(function() {
          return $(this).width();
      }).get();
      
      // Set the width of thead columns
      $table.find('thead tr').children().each(function(i, v) {
          $(v).width(colWidth[i]);
      });    
  }).resize(); // Trigger resize handler

        
 
