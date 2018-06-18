// Create a map object
var myMap = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 5
});
// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibGFpZnViYW9iYW8iLCJhIjoiY2poOW14b2wwMGVkcTNkbXNmbm56dG52cCJ9.DIVyJNQunpQSpP5tjiVfvA"
).addTo(myMap);



d3.csv("school_shooting.csv", function(error, SchoolData) {

  if (error) return console.warn(error);
  console.log(SchoolData);

  SchoolData.forEach(function (data) {
    
     lat = +data.Latitude;
     console.log(lat);
      lng = +data.Longitude;
      console.log(lng);
      city = data.Location;
      console.log(city);
      states = data.State;
      console.log(states);
      day = data.Date;
      console.log(day);


      
      
        L.marker([lat, lng])
          .bindPopup("<h1>" + city + "," + states + "</h1> <hr> <h3>Date: " + day + "</h3>")
          .addTo(myMap);
  
  });



});


