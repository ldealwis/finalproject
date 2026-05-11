const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});

const express = require('express');
const mongoose = require('mongoose');
const flightRouter = require('./routes/flighttracker');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log("Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Router Requirement
app.use('/flights', flightRouter);

app.get('/', (req, res) => {
    res.render('index'); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));