module.exports = {geocode}
const request = require('request')
function geocode (place) {
  if (!(typeof place === 'string')) return Promise.reject(new Error('place not a string'))
  const query = place.split(' ').join('+') + '+in+Madrid'
  const options = {
    url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    qs: {
      query,
      key: 'AIzaSyDHYLM8y7ibady-FpLTSGuRHfIsXFrHabY'
    },
    json: true
  }
  console.log('google options', options)
  return new Promise(function (resolve, reject) {
    request.get(options, function (err, res) {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        console.log(res, res.statusCode)
        if (res.body) console.log(res.body)
        return reject(new Error(res.body))
      }
      console.log('google body', res.body)
      resolve(res.body.results[0].geometry.location)
      console.log('google', res.body, res.statusCode)
    })
  })
}

