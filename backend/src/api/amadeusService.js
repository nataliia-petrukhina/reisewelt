
import axios from "axios";
import HotelAmadeus from "../oldCode/hotelModelAmadeus.js";
let accessToken = ''; // Variable to store the access token von Amadeus API.
import HotelOffer from "../models/hotelOffer.js";


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
async function getHotelOffers(hotelIds) {
    if (!accessToken) {
        await getAccessToken();
    }

    try {
        const response = await axios.get(`https://test.api.amadeus.com/v3/shopping/hotel-offers`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { hotelIds }
        });

        const hotels = response.data.data || [];
        return hotels;

    } catch (error) {
        const status = error.response?.status;
        const hotelCode = hotelIds || 'unknown';

        if (status === 400) {
            try {
                const fallback = await HotelOffer.find({ "hotel.hotelId": hotelCode });

                console.log(`No offers found on Amadeus for ${hotelCode}. Using fallback from MongoDB.`);
                console.log(`Fallback HotelOffer:`, fallback);
                return fallback;
            } catch (err) {
                console.error(`Failed to find fallback HotelOffer for ${hotelCode}:`, err.message);
                throw err;
            }
        }

        console.error(`Error fetching hotel ${hotelCode} from Amadeus:`, error.response?.data || error.message);
        throw error;
    }
}

export default { getHotelOffers };

//1. Get a pass (token)
//2. Find hotels in the city
//3. Get prices from found hotels
//4. Save everything in the database 