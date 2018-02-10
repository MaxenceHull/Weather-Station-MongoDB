var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var data = require('../models/data.js');

router.get('/', function(req, res, next) {
  data.find(function(err, measurements) {
    if(err) return next(err);
    res.json(measurements);
  });
});

router.get('/temperature', function(req, res, next){
    data.find({}, 'date temperature -_id', {sort: 'date'}, function(err, measurements){
      if(err) return next(err);
      res.json(measurements);
    });
});

router.get('/temperature/actual', function(req, res, next){
    data.findOne({}, 'date temperature -_id', {sort: '-date'}, function(err, measurements){
      if(err) return next(err);
      res.json(measurements);
    });
});

router.get('/temperature/:from-:to', function(req, res, next) {
    var dateFrom = new Date(Number(req.params.from));
    var dateTo = new Date(Number(req.params.to));
    var nb_days = dateDiffInDays(dateFrom, dateTo);
    if(!dateTo.isValid() || !dateFrom.isValid() || nb_days < 0) {
        //error
        console.log("Error in /temperature/:from-:to");
    }
    data.find({ "date": {$gte: dateFrom, $lt: dateTo} }, 'date temperature -_id', {sort: 'date'}, function(err, measurements){
      if(err) return next(err);
      measurements = removeMultipleMeasurementsPerHour(measurements);
      for (var i = measurements.length - nb_days - 1; i >= -1; i = i - nb_days) {
        measurements.splice((i)+1 , (nb_days) - 1);
      }
      res.json(measurements);
    });
});

router.get('/temperature/max/:from-:to', function(req, res, next) {
    var dateFrom = new Date(Number(req.params.from));
    var dateTo = new Date(Number(req.params.to));
    var nb_days = dateDiffInDays(dateFrom, dateTo);
    if(!dateTo.isValid() || !dateFrom.isValid() || nb_days == 0) {
        //error
        console.log("Error in /temperature/max/:from-:to");
    }
    data.findOne({ "date": {$gte: dateFrom, $lte: dateTo} }, 'date temperature -_id', {sort: '-temperature'}, function(err, measurement){
      if(err) return next(err);
      res.json(measurement);
    });
});

router.get('/temperature/max/byDay/:from-:to', function(req, res, next){
  var dateFrom = new Date(Number(req.params.from));
  var dateTo = new Date(Number(req.params.to));
  if(!dateTo.isValid() || !dateFrom.isValid()) {
      console.log("Error in /temperature/max/byDay/:from-:to");
  }
  data.find({ "date": {$gte: dateFrom, $lt: dateTo} }, 'date temperature -_id', {sort: 'date'}, function(err, measurements){
    var maximum_measurements = [];
    while(dateFrom < dateTo){
      var temp = measurements.filter(function(measurement){
        return measurement.date >= dateFrom && measurement.date < dateFrom.addDays(1);
      });
      var max_measurement = {temperature: 100, date: undefined};
      for(i=0; i < temp.length; i++){
        if(temp[i].temperature <= max_measurement.temperature){
          max_measurement = temp[i];
        }
      }
      maximum_measurements.push(max_measurement);
      dateFrom = dateFrom.addDays(1);
    }
    res.json(maximum_measurements);
  });
});

router.get('/temperature/min/byDay/:from-:to', function(req, res, next){
  var dateFrom = new Date(Number(req.params.from));
  var dateTo = new Date(Number(req.params.to));
  if(!dateTo.isValid() || !dateFrom.isValid()) {
      console.log("Error in /temperature/max/byDay/:from-:to");
  }
  data.find({ "date": {$gte: dateFrom, $lt: dateTo} }, 'date temperature -_id', {sort: 'date'}, function(err, measurements){
    var minimum_measurements = [];
    while(dateFrom < dateTo){
      var temp = measurements.filter(function(measurement){
        return measurement.date >= dateFrom && measurement.date < dateFrom.addDays(1);
      });
      var min_measurement = {temperature: -100, date: undefined};
      for(i=0; i < temp.length; i++){
        if(temp[i].temperature > min_measurement.temperature){
          min_measurement = temp[i];
        }
      }
      minimum_measurements.push(min_measurement);
      dateFrom = dateFrom.addDays(1);
    }
    res.json(minimum_measurements);
  });
});

router.get('/temperature/min/:from-:to', function(req, res, next) {
    var dateFrom = new Date(Number(req.params.from));
    var dateTo = new Date(Number(req.params.to));
    var nb_days = dateDiffInDays(dateFrom, dateTo);
    if(!dateTo.isValid() || !dateFrom.isValid() || nb_days == 0) {
        //error
        console.log("Error in /temperature/min/:from-:to");
    }
    data.findOne({ "date": {$gte: dateFrom, $lte: dateTo} }, 'date temperature -_id', {sort: 'temperature'}, function(err, measurement){
      if(err) return next(err);
      res.json(measurement);
    });
});

router.get('/brightness', function(req, res, next){
    data.find({}, 'date brightness -_id', {sort: 'date'}, function(err, measurements){
      if(err) return next(err);
      res.json(measurements);
    });
});

router.get('/brightness/actual', function(req, res, next){
    data.findOne({}, 'date brightness -_id', {sort: '-date'}, function(err, measurements){
      if(err) return next(err);
      res.json(measurements);
    });
});

router.get('/brightness/:from-:to', function(req, res, next) {
    var dateFrom = new Date(Number(req.params.from));
    var dateTo = new Date(Number(req.params.to));
    var nb_days = dateDiffInDays(dateFrom, dateTo);
    if(!dateTo.isValid() || !dateFrom.isValid()) {
        //error
        console.log("Error!");
    }
    data.find({ "date": {$gte: dateFrom, $lte: dateTo} }, 'date brightness -_id', {sort: 'date'}, function(err, measurements){
      if(err) return next(err);
      measurements = removeMultipleMeasurementsPerHour(measurements);
      for (var i = measurements.length - nb_days - 1; i >= -1; i = i - nb_days) {
        measurements.splice((i)+1 , (nb_days) - 1);
      }
      res.json(measurements);
    });

});

router.get('/brightness/max/:from-:to', function(req, res, next) {
    var dateFrom = new Date(Number(req.params.from));
    var dateTo = new Date(Number(req.params.to));
    var nb_days = dateDiffInDays(dateFrom, dateTo);
    if(!dateTo.isValid() || !dateFrom.isValid() || nb_days == 0) {
        //error
        console.log("Error in /brightness/max/:from-:to");
    }

    data.findOne({ "date": {$gte: dateFrom, $lte: dateTo} }, 'date brightness -_id', {sort: '-brightness'}, function(err, measurement){
      if(err) return next(err);
      res.json(measurement);
    });
});

router.get('/brightness/min/:from-:to', function(req, res, next) {
    var dateFrom = new Date(Number(req.params.from));
    var dateTo = new Date(Number(req.params.to));
    var nb_days = dateDiffInDays(dateFrom, dateTo);
    if(!dateTo.isValid() || !dateFrom.isValid() || nb_days == 0) {
        //error
        console.log("Error in /brightness/min/:from-:to");
    }
    data.findOne({ "date": {$gte: dateFrom, $lte: dateTo} }, 'date brightness -_id', {sort: 'brightness'}, function(err, measurement){
      if(err) return next(err);
      res.json(measurement);
    });
});

router.get('/brightness/max/byDay/:from-:to', function(req, res, next){
  var dateFrom = new Date(Number(req.params.from));
  var dateTo = new Date(Number(req.params.to));
  if(!dateTo.isValid() || !dateFrom.isValid()) {
      console.log("Error in /temperature/max/byDay/:from-:to");
  }
  data.find({ "date": {$gte: dateFrom, $lt: dateTo} }, 'date brightness -_id', {sort: 'date'}, function(err, measurements){
    var maximum_measurements = [];
    while(dateFrom < dateTo){
      var temp = measurements.filter(function(measurement){
        return measurement.date >= dateFrom && measurement.date < dateFrom.addDays(1);
      });
      var max_measurement = {brightness: 10000, date: undefined};
      for(i=0; i < temp.length; i++){
        if(temp[i].brightness <= max_measurement.brightness){
          max_measurement = temp[i];
        }
      }
      maximum_measurements.push(max_measurement);
      dateFrom = dateFrom.addDays(1);
    }
    res.json(maximum_measurements);
  });
});

router.get('/brightness/min/byDay/:from-:to', function(req, res, next){
  var dateFrom = new Date(Number(req.params.from));
  var dateTo = new Date(Number(req.params.to));
  if(!dateTo.isValid() || !dateFrom.isValid()) {
      console.log("Error in /temperature/max/byDay/:from-:to");
  }
  data.find({ "date": {$gte: dateFrom, $lt: dateTo} }, 'date brightness -_id', {sort: 'date'}, function(err, measurements){
    var minimum_measurements = [];
    while(dateFrom < dateTo){
      var temp = measurements.filter(function(measurement){
        return measurement.date >= dateFrom && measurement.date < dateFrom.addDays(1);
      });
      var min_measurement = {brightness: -100, date: undefined};
      for(i=0; i < temp.length; i++){
        if(temp[i].brightness > min_measurement.brightness){
          min_measurement = temp[i];
        }
      }
      minimum_measurements.push(min_measurement);
      dateFrom = dateFrom.addDays(1);
    }
    res.json(minimum_measurements);
  });
});

function getMaximumTemperatureByDay(day){
  var dateFrom = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  var dateTo = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
  data.findOne({ "date": {$gte: dateFrom, $lt: dateTo} }, 'date temperature -_id', {sort: 'temperature'}, function(err, measurement){
    if(err) return next(err);
    return measurement;
  });
}

Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

function removeMultipleMeasurementsPerHour(measurements){
  var result = [];
  measurements.forEach(function(item, index) {
    var existsAtPosition = result.findIndex(function(entry) {
      return item.date.getFullYear() == entry.date.getFullYear() &&
      item.date.getDate() == entry.date.getDate() &&
      item.date.getHours() == entry.date.getHours();
    })
    if (existsAtPosition == -1) {
      result.push(item);
    }
  })
  return result;
}

function dateDiffInDays(dateOne, dateTwo){
  return Math.floor((dateTwo - dateOne)/86400000);
}


module.exports = router;
