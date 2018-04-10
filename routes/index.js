var express = require('express');
var router = express.Router();
var request = require('request');
var stations = require('../stations.js');
var wmataKey = require('../wmata-api-key.js');

let stationNames = Array.from(new Set(stations.map(s => {
	return s.stationInfo.Name
})));
stationNames.sort()

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expressly', stations: stationNames, stationName: '' });
});

router.get('/station', function(req, res, next) {
  let station;
  let stationCodes = [];
  let incidents = [];
  if (req.query.name && stationNames.includes(req.query.name)) {
  	station = req.query.name;
  	stations.map((i)=>{
  		if (i.stationInfo.Name == station) {
  			stationCodes.push(i.stationInfo.Code);
  		}
  	});
  	console.log("stationCodes", stationCodes);
    let count = 0
  	stationCodes.forEach((i)=>{
  		console.log('getting incidents for', i);
  		let options = {
	  		url: 'https://api.wmata.com/Incidents.svc/json/ElevatorIncidents?StationCode='+i,
	  		headers: {
	  			api_key: wmataKey
	  		}
	  	}
	  	request(options, (err, res, bod) => {
	  		if (err) {
	  			console.log(err);
	  		} else {
          count++; 
	  			console.log(typeof bod);
	  			if (JSON.parse(bod).ElevatorIncidents && JSON.parse(bod).ElevatorIncidents.length > 0){
	  				JSON.parse(bod).ElevatorIncidents.forEach(i=>{
              console.log(i);
		  				incidents.push(i);
		  			});
	  			}
	  		}
        if (count == stationCodes.length) {
          console.log(count, 'incidents', incidents);
        }
	  	});
  	});
  } else {
  	station = '';
  }
  res.json({stationName: station});
});

module.exports = router;
