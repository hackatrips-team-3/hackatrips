const rider = {name: 'John Doe'}
const db = require('./db')
const cabify = require('./cabify')
module.exports = {makeReservation}

function makeReservation (userID, originalStop, destination, startAt) {
  const closeTrip = getCloseTrip(originalStop, destination, startAt)
  if (!closeTrip) {
    const stops = [originalStop, destination]
    let vehicleID
    let firstPrice
    let tripID
    return cabify.checkRoute(stops, startAt)
      .then(function (vehicles) {
        vehicleID = vehicles[1].vehicle_type._id
        firstPrice = vehicles[1].total_price
        return cabify.makeReservation(stops, startAt, rider, vehicleID)
      })
      .then(function (idToCancel) {
        tripID = idToCancel._id
      })
      .then(function () {
        const trip = {
          userIDs: [userID],
          stops,
          price: firstPrice,
          numberOfPeople: 1,
          vehicleID,
          startAt,
          tripID

        }
        db.trips.push(trip)
        return trip
      })
  } else {
    const {userIDs, startAt: oldStartAt, stops: oldStops, price: oldPrice, tripID: oldTripID, numberOfPeople, vehicleID} = closeTrip
    const stops = oldStops.concat(destination)
    let price
    let tripID
    return cabify.checkRoute(stops, oldStartAt)
      .then(function (vehicles) {
       price = vehicles[1].total_price

       if (price / (numberOfPeople + 1) < oldPrice || true) {
         return cabify.changeTrip(oldTripID, stops, rider, vehicleID)
       } else {
         console.log('do this')
       }
      })
      .then(function (result) {
        userIDs.push(userID)
        closeTrip.stops = stops
        closeTrip.price = price
        closeTrip.tripID = result._id
        closeTrip.numberOfPeople = numberOfPeople + 1
        return closeTrip
      })
      .catch(e => console.error(e))
  }
}

function getCloseTrip (originalStop, destination, startAt) {
  var trip = db.trips.find(t => t.numberOfPeople === 1)
  if (!trip) return null
  return trip
}







/*



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
  .catch(e => console.error(e))*/
