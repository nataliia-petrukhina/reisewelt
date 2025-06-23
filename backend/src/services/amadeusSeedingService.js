
// const axios = require('axios');
import axios from "axios";
import HotelOffer from "../models/hotelOffer.js";
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

        //wir erhalten die ganze liste von Paris Hotels
        const searchedHotelList = response.data.data;
        const limitedHotels = searchedHotelList.slice(0, 30);        // Sequenzielle Verarbeitung mit for...of

        //erstellen object type mongoose welchem können wir in mongodb speichern 
        for (const hotel of limitedHotels) {
            const newHotel = new SearchedHotel({
                hotelId: hotel.hotelId,
                name: hotel.name,
                // aber nicht für city
                chainCode: hotel.chainCode,
                iataCode: iataToCity[hotel.iataCode] || hotel.iataCode, // Use the mapping or fallback to original iataCode
                geoCode: hotel.geoCode,
                ...(hotel.address?.countryCode && {
                    address: { countryCode: hotel.address.countryCode }
                })
            });
// wir nehmen object type mongoose und speichern das
            try {
                await newHotel.save();
                const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                await fetchAndSaveHotelOffers(hotel.hotelId); // Fetch and save hotel offers for each hotel
                await wait(500); // Wait for 500 milliseconds before processing the next hotel
                // console.log(`Hotel ${newHotel.hotelId} saved successfully`);
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
async function fetchAndSaveHotelOffers(hotelId) {
    try {
        if (!accessToken) {
            await getAccessToken(); // Check if access token is available, if not, fetch it
        }
        const res = await axios.get(
            `https://test.api.amadeus.com/v3/shopping/hotel-offers`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                //bestRateOnly=false
                params: {
                    hotelIds: hotelId // "hotelIds" ist die Bezeichnung von Amadeus Api und wird als String genommen
                }
            }
        );

        const hotels = res.data?.data ?? [];
//!! hier nehmen wir alle offers
        for (const data of hotels) {
            if (!data?.offers?.length) continue;

            const cleanedOffers = data.offers.map(offer => ({
                id: offer.id ?? '',
                checkInDate: offer.checkInDate,
                checkOutDate: offer.checkOutDate,
                rateCode: offer.rateCode ?? '',
                rateFamilyEstimated: {
                    code: offer.rateFamilyEstimated?.code ?? '',
                    type: offer.rateFamilyEstimated?.type ?? ''
                },
                boardType: offer.boardType ?? '',
                category: offer.category ?? '',
                commission: {
                    percentage: offer.commission?.percentage ?? ''
                },
                description: {
                    text: offer.description?.text ?? '',
                    lang: offer.description?.lang ?? ''
                },
                room: {
                    type: offer.room?.type ?? '',
                    typeEstimated: {
                        category: offer.room?.typeEstimated?.category ?? '',
                        beds: offer.room?.typeEstimated?.beds ?? 0,
                        bedType: offer.room?.typeEstimated?.bedType ?? ''
                    },
                    description: {
                        text: offer.room?.description?.text ?? '',
                        lang: offer.room?.description?.lang ?? ''
                    }
                },
                roomInformation: {
                    description: offer.roomInformation?.description ?? '',
                    type: offer.roomInformation?.type ?? '',
                    typeEstimated: {
                        bedType: offer.roomInformation?.typeEstimated?.bedType ?? '',
                        beds: offer.roomInformation?.typeEstimated?.beds ?? 0,
                        category: offer.roomInformation?.typeEstimated?.category ?? ''
                    },
                    name: {
                        text: offer.roomInformation?.name?.text ?? ''
                    },
                    maxPersonCapacity: {
                        total: offer.roomInformation?.maxPersonCapacity?.total ?? 0,
                        adults: offer.roomInformation?.maxPersonCapacity?.adults ?? 0,
                        children: offer.roomInformation?.maxPersonCapacity?.children ?? 0
                    }
                },
                guests: {
                    adults: offer.guests?.adults ?? 1
                },
                price: {
                    currency: offer.price?.currency ?? '',
                    base: offer.price?.base ?? '',
                    total: offer.price?.total ?? '',
                    taxes: offer.price?.taxes ?? [],
                    variations: {
                        average: {
                            base: offer.price?.variations?.average?.base ?? ''
                        },
                        changes: (offer.price?.variations?.changes || []).map(c => ({
                            startDate: c.startDate,
                            endDate: c.endDate,
                            base: c.base ?? ''
                        }))
                    }
                },
                policies: {
                    cancellations: (offer.policies?.cancellations || []).map(c => ({
                        description: {
                            text: c.description?.text ?? ''
                        },
                        policyType: c.policyType ?? '',
                        numberOfNights: c.numberOfNights ?? 0,
                        deadline: c.deadline ?? null,
                        amount: c.amount ?? ''
                    })),
                    guarantee: offer.policies?.guarantee ?? {},
                    holdTime: offer.policies?.holdTime ?? {},
                    paymentType: offer.policies?.paymentType ?? '',
                    refundable: {
                        cancellationRefund: offer.policies?.refundable?.cancellationRefund ?? ''
                    }
                },
                self: offer.self ?? ''
            }));

//object für offers
            const hotelData = {
                type: data.type,
                hotel: {
                    _type: data.hotel.type,
                    hotelId: data.hotel.hotelId,
                    chainCode: data.hotel.chainCode,
                    dupeId: data.hotel.dupeId,
                    name: data.hotel.name,
                    cityCode: data.hotel.cityCode,
                    latitude: data.hotel.latitude,
                    longitude: data.hotel.longitude
                },
                available: data.available,
                self: data.self ?? '',
                offers: cleanedOffers
            };

            await HotelOffer.create(hotelData);
            console.log(`Saved hotel ${data.hotel.hotelId} with ${cleanedOffers.length} offers`);
        }
    } catch (error) {
        const status = error.response?.status;
        const hotelCode = hotelId || 'unknown';

        // wen wir die fehler erhalten , wir generieren ein fake offer
        if (status === 400) {
            console.warn(`Hotel ${hotelCode} gave 400 – saving as fake offer.`);

            // Save an fake HotelOffer with fallback data
            const hotelDataFromError = error.response?.data?.data?.[0]?.hotel;
            const today = new Date();
            const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

            const fakeOffer = {
                id: `FAKE-${hotelCode}-${Date.now()}`,
                checkInDate: today.toISOString().split('T')[0],
                checkOutDate: tomorrow.toISOString().split('T')[0],
                rateCode: 'FAKE',
                rateFamilyEstimated: {
                    code: 'DEMO',
                    type: 'P'
                },
                boardType: 'ROOM_ONLY',
                category: 'STANDARD',
                commission: {
                    percentage: '0'
                },
                description: {
                    text: 'This is a demo offer generated due to missing real offers.',
                    lang: 'EN'
                },
                room: {
                    type: 'STD',
                    typeEstimated: {
                        category: 'STANDARD_ROOM',
                        beds: 1,
                        bedType: 'DOUBLE'
                    },
                    description: {
                        text: 'Demo Room - 1 Bed, Air Conditioned, Sea View',
                        lang: 'EN'
                    }
                },
                roomInformation: {
                    description: 'Fictional room used for fallback purposes.',
                    type: 'STD',
                    typeEstimated: {
                        bedType: 'DOUBLE',
                        beds: 1,
                        category: 'STANDARD_ROOM'
                    },
                    name: {
                        text: 'Fallback Room'
                    },
                    maxPersonCapacity: {
                        total: 2,
                        adults: 2,
                        children: 0
                    }
                },
                guests: {
                    adults: 1
                },
                price: {
                    currency: 'EUR',
                    base: (Math.random() * 100 + 50).toFixed(2), // from 50 to 150
                    total: (Math.random() * 100 + 60).toFixed(2), //from 60 to 160
                    taxes: [],
                    variations: {
                        average: {
                            base: '100.00'
                        },
                        changes: [{
                            startDate: today,
                            endDate: tomorrow,
                            base: '100.00'
                        }]
                    }
                },
                policies: {
                    cancellations: [{
                        description: { text: 'Cancellation not allowed' },
                        policyType: 'CANCELLATION',
                        numberOfNights: 0,
                        deadline: null,
                        amount: '0.00'
                    }],
                    guarantee: {},
                    holdTime: {},
                    paymentType: 'guarantee',
                    refundable: {
                        cancellationRefund: 'NON_REFUNDABLE'
                    }
                },
                self: ''
            };
//erstellen fake hotel
            const fallbackHotelData = {
                type: 'hotel-offers',
                hotel: {
                    _type: 'hotel',
                    hotelId: hotelCode,
                    chainCode: '',
                    dupeId: '',
                    name: `Hotel ${hotelCode} (fallback)`,
                    cityCode: '',
                    latitude: 0,
                    longitude: 0
                },
                available: false,
                self: '',
                //fake offer in offer und save
                offers: [fakeOffer]
            };
            try {
                await HotelOffer.create(fallbackHotelData);
                console.log(`Saved fallback HotelOffer for ${hotelCode}`);
            } catch (saveError) {
                console.error(`Failed to save fallback HotelOffer for ${hotelCode}:`, saveError.message);
            }

        } else if (status === 429) {
            console.error(`Rate limit hit for ${hotelCode} (429).`);
        } else {
            console.error(`Error by fetch hotel ${hotelCode}:`, error.response?.data || error.message);
        }

    }
}
export default { fetchAndSaveHotels, fetchAndSaveHotelOffers };
