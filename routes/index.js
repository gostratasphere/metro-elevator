const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const stations = require('../stations.js');
const wmataKey = require('../wmata-api-key.js');

const stationNames = Array.from(new Set(stations.map(s => {
	return s.stationInfo.Name
})));
stationNames.sort()
 //convert to only api and react on the frontend
router.get('/', function(req, res, next) {
  res.render('index', { title: "Where's my Metro Elevator?", stations: stationNames, stationName: '', entrances: [], incidents:[] });
});

router.get('/station-list', function(req, res, next){
	res.json(stations);
});

router.get('/stat', function(req, res, next) {
	let stationCode = '';
	let stationUrl = '';
	let stationId = '';
	if (req.query.name && stationNames.includes(req.query.name)) {
		console.log(req.query.name);
  	station = req.query.name;
  	stations.map((i)=>{
  		if (i.stationInfo.Name == station) {
				stationCode = i.stationInfo.Code;
				stationId = i.stationInfo.StationId;
				stationUrl = "https://wmata.com/components/stations.cfc"
			}
			console.log(stationId, stationUrl)

		});
		let body = {
			method: "renderStationStatus",
			stationID: stationId
		};
		fetch(stationUrl + "?method=renderStationStatus&stationID=" + stationId).then(d => {
			d.text().then(data => {
				console.log(data);
				res.send(data);
			})
		})
	}
	else {
		res.send('no data available');
	}
})

router.get('/station', function(req, res, next) {
  let stationArray = [];
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
      // getStation(stations, i)
      stations.forEach(station => {
        if (station.stationInfo.Code == i) {
          stationArray.push(station);
        }
      });
  		console.log('getting incidents for', i);
  		let options = {
	  		url: 'https://api.wmata.com/Incidents.svc/json/ElevatorIncidents?StationCode='+i,
	  		headers: {
	  			api_key: wmataKey
	  		}
	  	}
	  	request(options, (erro, resp, bod) => {
	  		if (erro) {
	  			console.log(erro);
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
          // stationArray[0].stationEntrances.forEach(j => {

          // })
          console.log("stationArray", stationArray)
          console.log("stationIncidents", incidents);
          res.json({stationName: station, entrances: stationArray[0].stationEntrances, incidents: incidents})
        }
	  	});
  	});
  } else {
  	station = '';
    res.json({stationName: station});
  }
  
});

// dont think this does anything
// function getStation(stations, stationCode){
//   let stationArray = [];
  
//   return stationArray;
// }

module.exports = router;
