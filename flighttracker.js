const express = require('express');
const router = express.Router();
const Flight = require('../models/flighttrackerschema');

router.post('/track', async (req, res) => {
    if (!req.body || !req.body.flightNumber) {
        return res.status(400).send("Error: Flight Number is required.");
    }

    const requestedIata = req.body.flightNumber.toUpperCase().trim();
    const apiKey = "932cea33303a78e035d660f47db017a1"
   
    try {
        const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${requestedIata}`;
        const response = await fetch(url); 
        const result = await response.json();

        if (!result || !result.data || result.data.length === 0) {
            console.error("API Error or No Data:", result.error || "No flights found");
            return res.status(404).send("Flight data not available");
        }

        console.log("API Result received successfully");

        const foundFlight = result.data.find(f => 
             f.flight && (f.flight.iata === requestedIata || f.flight.number === requestedIata)
            );
        if (!foundFlight) {
             return res.status(404).send(`Flight ${requestedIata} is not currently in the live tracking buffer. Try a different flight or check back later.`);
            }
        const formatTime = (timeString) => {
            if (!timeString) return "N/A";
            const date = new Date(timeString);
            return date.toLocaleString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true,
                month: 'short',
                day: 'numeric'
    });
};
        const entry = new Flight({
            airline: foundFlight.airline?.name || "N/A",
            departureAirport: foundFlight.departure?.airport || "N/A",
            departureCountry: foundFlight.departure?.country || foundFlight.departure?.iata || "International",
            arrivalAirport: foundFlight.arrival?.airport || "N/A",
            arrivalCountry: foundFlight.arrival?.country || foundFlight.arrival?.iata || "International",
            departureTime: formatTime(foundFlight.departure?.scheduled),
            arrivalTime: formatTime(foundFlight.arrival?.scheduled),
            flightNum: foundFlight.flight?.iata || requestedIata,
            status: foundFlight.flight_status || "active"
});

        await entry.save();
        res.render('details', { flight: entry });
        
    } catch (err) {
        console.error("DETAILED ERROR:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});

module.exports = router;
        