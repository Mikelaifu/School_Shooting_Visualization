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
  
  url = '/table2';
  d3.json(url,  function(dataSet) {
      
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