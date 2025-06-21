
// require('dotenv').config();
import 'dotenv/config';
// const express = require('express');
import express from 'express';
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const hotelsRoutes = require('./routes/hotelsRoutes');
import hotelsRoutes from './routes/hotelsRoutes.js';
// const cors = require('cors');
import cors from 'cors';
import SearchedHotel from "./models/searchedHotel.js";
import amadeusService from "./api/amadeusService.js"
<<<<<<< HEAD

=======
>>>>>>> f0adbf1 (Searched hotels in MONGO DB gespeichert sind)


const app = express();
const PORT = process.env.PORT || 3000;
const cityCodes = ["PAR", "BER", "ROM", "MAD", "VIE", "AMS", "BRU", "CPH", "STO", "LON"];
<<<<<<< HEAD

=======
>>>>>>> f0adbf1 (Searched hotels in MONGO DB gespeichert sind)

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/hotels', hotelsRoutes);//!!

// DB connection
<<<<<<< HEAD
//Checks the database - if there is already data on hotels
//If there is no data - starts the filling process:
//For each city from the cityCodes array calls amadeusService.fetchAndSaveHotels()
//This loads hotel data via Amadeus API and saves it to the database.
=======
>>>>>>> f0adbf1 (Searched hotels in MONGO DB gespeichert sind)
mongoose.connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log('MongoDB connected');

    const exists = await SearchedHotel.findOne();
    if (!exists) {
      console.log("Database will be filled with hotel data.");
      cityCodes.forEach(city => {
        amadeusService.fetchAndSaveHotels(city);
      });
      console.log("Database filling is done.");
    } else {
      console.log("Database is already filled.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));


