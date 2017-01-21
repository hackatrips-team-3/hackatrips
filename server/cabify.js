module.exports = {checkRoute}

const config = require ('./config')
const request = require('request')
const url = require('url')
// stops = {lat, lng}
function checkRoute (stops, startAt) {
  stops = [{lat: 40.4169473, lng:  -3.7057172}]
  startAt = "2022-12-30 22:59"
  const apiStops = stops.map(s => {return {loc: [s.lat, s.lng]}})
  const apiStops2 = [
      {
        "loc": [
          40.4169473,
          -3.7057172
        ],
        "name": "Puerta del Sol",
        "addr": "Plaza de la Puerta del Sol",
        "num": "s/n",
        "city": "Madrid",
        "country": "Spain",
        "hit_at": "2022-12-30 22:59"
      },
    {
      "loc": [
        40.4169473,
        -3.8057172
      ],
      "name": "Puerta del Sol",
      "addr": "Plaza de la Puerta del Sol",
      "num": "s/n",
      "city": "Madrid",
      "country": "Spain",
      "hit_at": "2022-12-30 22:59"
    },
    {
      "loc": [
        40.4169473,
        -3.6057172
      ],
      "name": "Puerta del Sol",
      "addr": "Plaza de la Puerta del Sol",
      "num": "s/n",
      "city": "Madrid",
      "country": "Spain",
      "hit_at": "2022-12-30 22:59"
    }
    ]

  const options = {
    url: config.cabifyURL + '/estimate',
    json: true,
    headers: {
      Authorization: `Bearer ${config.cabifyToken}`,
      'Accept-language': 'en'
    },
    body: {
      stops: apiStops2,
      start_at: startAt
    }
  }
  console.log(options)

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, res) {
      if (err) return reject(err)
      resolve(res.body)
      console.log('cabify', res.body, res.statusCode)
    })
  })
}