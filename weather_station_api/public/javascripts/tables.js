/*var dataSet = [
  {
    "_id":"5994be3",
    "date":"2017-06-16T16:59:42.6",
    "room":"chamber",
    "temperature": "23.8",
    "brightness": 4,
  },
  {
    "_id":"5994be9",
    "date":"2016-06-16T16:59:42.6",
    "room":"chamber",
    "temperature":"20.3",
    "brightness": 58,
  }
];

$(document).ready(function() {
  $('#example').dataTable({
        data: dataSet
  });
  $.getJSON('/data', function(data) {
      window.alert(JSON.stringify(data));

  });

});*/

$(document).ready(function() {
    $('#example').DataTable( {
        "ajax": {
            "url": "/data",
            "dataSrc": ""
        },
        "columns": [
            { "data": "room" },
            { "data": "date" },
            { "data": "temperature" },
            { "data": "brightness" },
            { "data": "_id" }
        ]
    } );
} );
