
// const axios = require('axios');
import axios from "axios";
import HotelAmadeus from "../models/hotelModelAmadeus.js";
import SearchedHotel from "../models/searchedHotel.js";
let accessToken = ''; // Variable to store the access token von Amadeus API.



// Funktion zum Abrufen des Tokens (Zugriffsschlüssels)
async function getAccessToken() {
    try {
        //The data variable is created but never used. The new URLSearchParams object is used instead.
        //const data = {
        // grant_type: 'client_credentials', // Specify the grant type für unser token request
        //client_id: process.env.AMADEUS_API_KEY,
        //client_secret: process.env.AMADEUS_API_SECRET
        //};

        const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials', // Specify the grant type für unser token request
                client_id: process.env.AMADEUS_API_KEY,
                client_secret: process.env.AMADEUS_API_SECRET
            }));
        accessToken = response.data.access_token; //speichern access token in unsere Variable
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch access token');
    }
}


const iataToCity = {
    PAR: "paris",
    BER: "berlin",
    ROM: "rome",
    MAD: "madrid",
    VIE: "vienna",
    AMS: "amsterdam",
    BRU: "brussels",
    CPH: "copenhagen",
    STO: "stockholm",
    LON: "london"
};


// wir erstellen 2 Funktionen, sie werden unsere Hotels erhalten
async function fetchAndSaveHotels(cityCode) {
    try {
        if (!accessToken) {
            await getAccessToken(); // Check if access token is available, if not, fetch it
        }
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
            headers: {
                Authorization: `Bearer ${accessToken}` // ich habe token ich kann infoHotels sehen 
            },
            //Wir geben den Code der Stadt ein, in der wir Hotels suchen möchten. (BER, PAR; ROM)
            params: {
                cityCode
            }
        });
        const searchedHotelList = response.data.data;
        const limitedHotels = searchedHotelList.slice(0, 30);        // Sequenzielle Verarbeitung mit for...of
        for (const hotel of limitedHotels) {
            const newHotel = new SearchedHotel({
                hotelId: hotel.hotelId,
                name: hotel.name,
                chainCode: hotel.chainCode,
                iataCode: iataToCity[hotel.iataCode] || hotel.iataCode, // Use the mapping or fallback to original iataCode
                geoCode: hotel.geoCode,
                ...(hotel.address?.countryCode && {
                    address: { countryCode: hotel.address.countryCode }
                })
            });

            try {
                await newHotel.save();
                console.log(`Hotel ${newHotel.hotelId} saved successfully`);
            } catch (saveError) {
                console.error(`Failed to save hotel ${newHotel.hotelId}:`, saveError.message);
            }
        }
    } catch (error) {
        console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch hotels');
    }
}

//https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=EBLONEBE
async function getHotelOffers(hotelIds) {
    try {
        if (!accessToken) {
            await getAccessToken(); // Check if access token is available, if not, fetch it
        }
        const response = await axios.get(`https://test.api.amadeus.com/v3/shopping/hotel-offers`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { hotelIds } // "hotelIds" ist die Bezeichnung von Amadeus Api und wird als String genommen
        });
        // Die Amadeus API liefert ein Array unter response.data.data
        const hotels = response.data.data || []; // []

        // Für jeden Datensatz ein neues Mongoose-Dokument anlegen und speichern
        for (const hotel of hotels) {
            // Sicherstellen, dass die verschachtelten Eigenschaften existieren

            const hotelDataAmadeus = new HotelAmadeus({
                type: hotel.hotel.type,
                hotelId: hotel.hotel.hotelId,
                chainCode: hotel.hotel.chainCode,
                name: hotel.hotel.name,
                cityCode: hotel.hotel.cityCode,
                // address: hotel.hotel.address,
                // rating: hotel.hotel.rating,

                // ...weitere Felder
            });
            //  console.log(hotelDataAmadeus);
            try {
                await hotelDataAmadeus.save();
                console.log(`Hotel ${hotelDataAmadeus.hotelId} gespeichert.`);
            } catch (err) {
                console.error(`Fehler beim Speichern von Hotel ${hotelDataAmadeus.hotelId}:`, err.message);
            }
        }

        return hotels; // Optional: Rückgabe der gespeicherten Hotels
    } catch (error) {
        console.error('Error fetching hotels by hotelIds:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch hotels by hotelIds');
    }

}
export default { fetchAndSaveHotels, getHotelOffers };

//1. Get a pass (token)
//2. Find hotels in the city
//3. Get prices from found hotels
//4. Save everything in the database 