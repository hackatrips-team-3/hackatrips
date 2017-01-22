module.exports = {checkRoute, makeReservation, cancelTrip, changeTrip}

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
      //console.log('eta', res.body[0].vehicle_type.eta)
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
  console.log('reservation options', options)

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, res) {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        console.log('makeReservation err', res.body.errors)
        console.log(res.body, res.statusCode)
        return reject(new Error(res.body.message))
      }
      resolve(res.body)
      console.log('cabify', res.body, res.statusCode)
    })
  })
}

function cancelTrip (idToCancel) {
  if (!(typeof idToCancel === 'string')) return Promise.reject(new Error('not a string'))
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
  console.log('cancel trip options url', options.url)
  return new Promise(function (resolve, reject) {
    request.post(options, function (err, res) {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        console.log(res.body, res.statusCode)
        if (res.body) console.log(res.body.errors)
        return reject(new Error(res.body.message))
      }
      resolve(res.body)
      console.log('cabify', res.body, res.statusCode)
    })
  })
}

function changeTrip (idToCancel, stops, startAt, rider, vehicleID) {
  return cancelTrip(idToCancel)
    .then(function () {
      console.log('trip canceled')
      return makeReservation(stops, startAt, rider, vehicleID)
    })


}