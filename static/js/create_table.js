function tabulate(data, columns) {
    var table = d3.select('#table_format');
    
    
    var	tbody = table.append('tbody');
    var header = tbody.append('tr')
    .selectAll('td')
    .data(columns).enter()
    .append('td')
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
  };
  
  
  url = 'http://127.0.0.1:5000/table2';
  d3.json(url,  function(dataSet) {
      
    console.log(dataSet);
    // render the tables
    tabulate(dataSet, ['Date', 'Death', 'Injuries',  'Location',  'School_Name', 'School_Type', "State"]);
  
  
  });