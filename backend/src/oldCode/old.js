
//https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=EBLONEBE
/*async function getHotelOffers(hotelIds) {

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
*/