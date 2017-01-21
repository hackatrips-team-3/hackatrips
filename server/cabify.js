module.exports = {checkRoute, makeReservation, cancelTrip}

const config = require ('./config')
const request = require('request')
const url = require('url')
// stops = {lat, lng}
function checkRoute (stops, startAt) {
  const apiStops = stops.map(s => {return {loc: [s.lat, s.lng]}})

  const options = {
    url: config.cabifyURL + '/estimate',
    json: true,
    headers: {
      Authorization: `Bearer ${config.cabifyToken}`,
      'Accept-language': 'en'
    },
    body: {
      stops: apiStops,
      start_at: startAt
    }
  }
  console.log(options)

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, res) {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        return reject(new Error(res.body.message))
      }
      resolve(res.body)
      console.log('cabify', res.body, res.statusCode)
    })
  })
}

function makeReservation (stops, startAt, rider, vehicle_type_id) {
  // slice 0, 2 because the api is not yet ready for multiple journey
  const apiStops = stops.map(s => {return {loc: [s.lat, s.lng]}}).slice(0, 2)

  const body = {
    stops: apiStops,
    startAt,
    rider,
    vehicle_type_id
  }
  const options = {
    url: config.cabifyURL + '/journey',
    json: true,
    headers: {
      Authorization: `Bearer ${config.cabifyToken}`,
      'Accept-language': 'en'
    },
    body: body
  }

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, res) {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        console.log(res.body.errors)
        return reject(new Error(res.body.message))
      }
      resolve(res.body)
      console.log('cabify', res.body, res.statusCode)
    })
  })
}

function cancelTrip (idToCancel) {
  const options = {
    url: config.cabifyURL + '/journey/' + idToCancel + '/state',
    json: true,
    headers: {
      Authorization: `Bearer ${config.cabifyToken}`,
      'Accept-language': 'en'
    },
    body: {
      name: 'rider cancel'
    }
  }
  return new Promise(function (resolve, reject) {
    request.post(options, function (err, res) {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        console.log(res.body, res.statusCode)
        console.log(res.body.errors)
        return reject(new Error(res.body.message))
      }
      resolve(res.body)
      console.log('cabify', res.body, res.statusCode)
    })
  })
}