var dateFrom, dateTo;
var url_brightness = "/data/brightness/";
var url_temperature = "/data/temperature/";
var url_temperature_min = "/data/temperature/min/";
var url_temperature_max = "/data/temperature/max/";
var url_temperature_max_by_day = "/data/temperature/max/byDay/";
var url_temperature_min_by_day = "/data/temperature/min/byDay/";
var url_brightness_min = "/data/brightness/min/";
var url_brightness_max = "/data/brightness/max/";
var url_brightness_max_by_day = "/data/brightness/max/byDay/";
var url_brightness_min_by_day = "/data/brightness/min/byDay/";
var knobs_brightness = [".dial-brightness", ".dial-brightness-chart-min", ".dial-brightness-chart-max"];
var knobs_temperature = [".dial-temperature", ".dial-temperature-chart-min", ".dial-temperature-chart-max"];

// Initialization
$( "#datepicker-from" ).datepicker({
  onSelect: function() {
        dateFrom = $(this).datepicker('getDate');
        verifyDates();
        fill_charts();
        $("#charts").show();
    }
});

$( "#datepicker-to" ).datepicker({
  onSelect: function() {
    dateTo = $(this).datepicker('getDate');
    verifyDates();
    fill_charts();
    $("#charts").show();
  }
});

// Set up document
$(document).ready(function() {
  $("#alert-empty-field").hide();
  $("#charts").hide();

  for(i = 0; i < knobs_brightness.length; i++){
    init_knob(knobs_brightness[i], 0, 200);
    init_knob(knobs_temperature[i], -10, 50);
  }

  $.getJSON('/data/temperature/actual', function(measurement) {
    change_dial_temperature(".dial-temperature", measurement.temperature);
  });

  $.getJSON('/data/brightness/actual', function(data) {
    $(".dial-brightness").val(data.brightness).trigger('change');
  });

});

function fill_temperature_chart(){
  var nb_days = dateDiffInDays(dateFrom, dateTo);
  if ( nb_days > 6 && nb_days < 25) {
    $.getJSON(url_temperature_max_by_day.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(max_temperatures_measurements) {
      $.getJSON(url_temperature_min_by_day.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(min_temperatures_measurements) {
        var chart = new Chartist.Line('#chart1', {
          series: [preprocess_temperature_data_for_chartist(max_temperatures_measurements),
                   preprocess_temperature_data_for_chartist(min_temperatures_measurements)]
        }, {
          axisX: {
            type: Chartist.FixedScaleAxis,
            divisor: nb_days,
            labelInterpolationFnc: function(value) {
              return moment(value).format('MMM Do');
            }
          }
        });
      });
    });
  } else {
    $.getJSON(url_temperature.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(measurements) {
      var chart = new Chartist.Line('#chart1', {
        series: [preprocess_temperature_data_for_chartist(measurements)]
      }, {
        axisX: {
          type: Chartist.FixedScaleAxis,
          divisor: nb_days,
          labelInterpolationFnc: function(value) {
            return moment(value).format('MMM Do HH:mm');
          }
        }
      });
    });
  }
}

function fill_brightness_chart(){
  var nb_days = dateDiffInDays(dateFrom, dateTo);
  if ( nb_days > 6 && nb_days < 25) {
    $.getJSON(url_brightness_max_by_day.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(max_temperatures_measurements) {
      $.getJSON(url_brightness_min_by_day.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(min_temperatures_measurements) {
        var chart = new Chartist.Line('#chart2', {
          series: [preprocess_brightness_data_for_chartist(max_temperatures_measurements),
                   preprocess_brightness_data_for_chartist(min_temperatures_measurements)]
        }, {
          axisX: {
            type: Chartist.FixedScaleAxis,
            divisor: nb_days,
            labelInterpolationFnc: function(value) {
              return moment(value).format('MMM Do');
            }
          }
        });
      });
    });
  } else {
    $.getJSON(url_brightness.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(measurements) {
      var chart = new Chartist.Line('#chart2', {
        series: [preprocess_brightness_data_for_chartist(measurements)]
      }, {
        axisX: {
          type: Chartist.FixedScaleAxis,
          divisor: nb_days,
          labelInterpolationFnc: function(value) {
            return moment(value).format('MMM Do HH:MM');
          }
        }
      });
    });
  }
}

// Helper functions
function fill_dials(){
  $.getJSON(url_temperature_min.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(measurement) {
    change_dial_temperature(".dial-temperature-chart-min", measurement.temperature);
  });

  $.getJSON(url_temperature_max.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(measurement) {
    change_dial_temperature(".dial-temperature-chart-max", measurement.temperature);
  });

  $.getJSON(url_brightness_min.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(measurement) {
    $(".dial-brightness-chart-min").val(measurement.brightness).trigger('change');
  });

  $.getJSON(url_brightness_max.concat(dateFrom.getTime(), "-", dateTo.getTime()), function(measurement) {
    $(".dial-brightness-chart-max").val(measurement.brightness).trigger('change');
  });
}

function verifyDates() {
  if (dateFrom == undefined) {
    dateFrom = dateTo;
    $('#datepicker-from').datepicker("setDate", dateFrom);
  } else if (dateTo == undefined ){
    dateTo = new Date(dateFrom);
    dateTo.setDate(dateFrom.getDate() + 1);
    $('#datepicker-to').datepicker("setDate", dateTo);
  } else if (dateFrom > dateTo) {
    dateTo = dateFrom;
    $('#datepicker-to').datepicker("setDate", dateTo);
  }
}

function dateDiffInDays(dateOne, dateTwo){
  return Math.floor((dateTwo - dateOne)/86400000);
}

function preprocess_temperature_data_for_chartist(data){
  return data.map(function(x) {
    return {x: new Date(x.date), y: x.temperature};
  });
}

function preprocess_brightness_data_for_chartist(data){
  return data.map(function(x) {
    return {x: new Date(x.date), y: x.brightness};
  });
}

function fill_charts() {
  fill_temperature_chart();
  fill_brightness_chart();
  fill_dials();
}

function init_knob(id, min, max){
  $(id).knob({
      'min':min,
      'max':max,
      'readOnly': true
  });
}


function change_dial_temperature(id, temperature){
  $(id).val(temperature).trigger('change');
  var color;
  if (temperature < 16) {
    color = "#3399ff";
  } else if (temperature >= 16 && temperature < 21) {
    color = "#99ccff";
  } else if (temperature >= 21 && temperature < 25) {
    color = "#ccff66";
  } else {
    color = "#ff6666";
  }
  $(id).trigger(
        'configure',
        {
            "fgColor":color,
            'inputColor':color
        }
    );
}
