const restify = require('restify')
const builder = require('botbuilder')

const config = require('./config')
const dispatcher = require('./dispatcher')
const cabifyReservations = require('./cabify-reservations')
const geocode = require('./geocode')

const connector = new builder.ChatConnector({
   //appId: config.appId,
  //appPassword: config.appPassword
  })

const bot = new builder.UniversalBot(connector)

//LUIS natural language processing
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f854c21e-a18f-474c-862d-29ceee773b36?subscription-key=e7721191ec97407db8be3179d6cc8dc9&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

//Intent handlers
dialog.matches('Greetings', builder.DialogAction.send('Hello to you :smile: more_detail. Where do you wanna go?'));

dialog.matches('BookTaxi', [
    function (session, args, next) {
    	//console.log(args)
        // Resolve and store any entities passed from LUIS.
        var location = builder.EntityRecognizer.findEntity(args.entities, 'Location');
        geocode
        var time = builder.EntityRecognizer.findEntity(args.entities, 'timeUntilReady');
        console.log('ENTITIES', location, time)
        var booking = {
        	time: time ? time.entity : null,
        	location: location ? location.entity : null
        }
        session.dialogData.booking = booking

        // Prompt for title
        if (!booking.location) {
            builder.Prompts.text(session, 'What\'s your destination?')
        } else {
            next();
        }
    },
    function (session, results, next) {
    	console.log('second block')
    	var booking = session.dialogData.booking
		if (results.response) {
			console.log('RESPONSE', results)
			booking.location = results.response
        } 

        if (booking.location && !booking.time){
        	builder.Prompts.text(session, 'When do you want your cab?')
        } else {
        	next()
        }


    },
    function (session, results) {
        var booking = session.dialogData.booking;
        if (results.response) {
        	r = /[0-9]+/
  			minutes = results.response.match(r)
  			currentTime = new Date()
  			bookingTime = currentTime.setMinutes(currentTime.getMinutes() + parseInt(minutes));
            booking.time = new Date(bookingTime)
            console.log('TIME', booking.time)
        }

        if (booking.location && booking.time) {
           session.send(`Ok! Cab to: ${booking.location}. Be ready at: ${booking.time.getHours()}:${booking.time.getMinutes()}`) 
           const originalStop = {lat: 40.4169473, lng: -3.7057172}
            // TODO geocoding
           const destination = {lat: 40.418989, lng: -3.706093}
           const startAt =  "2017-01-22 19:50"
           const userId = session.message.address.user.id
           geocode.geocode(booking.location)
             .then(function (latlng) {
                 console.log('latlng place', latlng)
                 return cabifyReservations.makeReservation(userId, originalStop, destination, startAt)

             })
            .then(function (trip) {
                 console.log('trip', trip)
             })
        }
    }
]);

dialog.matches('cancelBooking', builder.DialogAction.send('You got it. Booking cancelled'));
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand."));

const server = restify.createServer()
server.listen(8080)
server.post('/', connector.listen())
console.log('listening')