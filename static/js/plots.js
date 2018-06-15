
var $buttonYear = Plotly.d3.select("#buttonYear"); 
function BuildDropdown() {
    // Get data from '/names' endpoint
    base_url = 'http://127.0.0.1:5000'
    url = base_url + "/year"
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
    
   
  };
  
  
  BuildDropdown();



  function buildMap(year) {
    base_url = 'http://127.0.0.1:5000';
    url = base_url + '/map/' + year;
    
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

            
                var street=  L.tileLayer(
                    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
                    "access_token=pk.eyJ1IjoidHJhdmlzZG9lc21hdGgiLCJhIjoiY2poOWNrYjRkMDQ2ejM3cGV1d2xqa2IyeCJ9.34tYWBvPBM_h8_YS3Z7__Q"
                            );
                var darkmap = L.tileLayer(
                        "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
                        "access_token=pk.eyJ1IjoidHJhdmlzZG9lc21hdGgiLCJhIjoiY2poOWNrYjRkMDQ2ejM3cGV1d2xqa2IyeCJ9.34tYWBvPBM_h8_YS3Z7__Q"
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

    