const rider = {name: 'John Doe'}
const stops = [{lat: 40.4169473, lng:  -3.7057172}, {lat: 40.418989, lng: -3.706093}]
const startAt = "2017-01-21 19:50"
const newStops = stops.concat({lat: 40.422975, lng: -3.710116})
let vehicleID
let firstPrice
let firstId
//console.log(session)
cabify.checkRoute(stops, startAt)
  .then(function (vehicles) {
    vehicleID = vehicles[0].vehicle_type._id
    firstPrice = vehicles[0].total_price
    return cabify.makeReservation(stops, startAt, rider, vehicleID)
  })
  .then(function (idToCancel) {
    firstId = idToCancel._id
    return cabify.checkRoute(newStops, startAt)
  })
  .then(function (vehicles) {
    console.log(vehicles[0].vehicle_type._id, vehicleID, vehicles[0].total_price, firstPrice)
    console.log('lets try to change trip')
    return cabify.changeTrip(firstId, newStops, startAt, rider, vehicleID)
  })
  .then(function (result) {
    console.log(result)
  })
  .catch(e => console.error(e))