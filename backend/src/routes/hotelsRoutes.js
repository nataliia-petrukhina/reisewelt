
// const express = require('express');
import express from 'express';
// const amadeusServise = require('../api/amadeusService');
import amadeusService from "../api/amadeusService.js"
import SearchedHotel from "../models/searchedHotel.js"

// Erstelle einen Router aus Express
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) {
      filter.iataCode = { $regex: req.query.city, $options: 'i' }; //egal welche erste buchstabe groß oder klein geschrieben ist
    }
    const hotels = await SearchedHotel.find(filter);
    res.json(hotels);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/* router.get('/amadeus/cityCode', async (req, res) => {
  try {
    const cityCode = req.query.cityCode;

    //const hotels = await amadeusService.getHotelsByCityCode(cityCode);
    const hotels = await SearchedHotel.find({ iataCode: cityCode });
    res.json(hotels);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}); */


//neue route für hotels von Amadeus API
// route lautet: http://localhost:3000/api/hotels/amadeus/hotelId
router.get('/amadeus/hotelId', async (req, res) => {

  try {
    const hotelId = req.query.hotelId;
    const hotels = await amadeusService.getHotelOffers(hotelId);
    res.json(hotels);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
// module.exports = router;

