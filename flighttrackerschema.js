const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNum: String,
    airline: String,
    departureAirport: String,
    departureCountry: String,
    arrivalAirport: String,
    arrivalCountry: String,
    departureTime: String, 
    arrivalTime: String,   
    status: String
    
});

module.exports = mongoose.model('Flight', flightSchema);