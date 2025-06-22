import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";


export default function OfferComponent() {
    const [hotelData, setHotelData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { hotelId } = useParams();
    useEffect(() => {
        console.log("OfferComponent mounted with hotelId:", hotelId);
        const fetchOfferByHotelId = async () => {
            if (!hotelId) return;

            setLoading(true);
            setError("");
            try {
                const res = await axios.get("http://localhost:3000/api/hotels/amadeus/hotelId", {
                    params: { hotelId }
                });
                console.log("Fetched hotel data:", res.data);
                const data = res.data?.[0];
                const hotel = data?.hotel;
                console.log("Hotel data:", hotel);
                setHotelData(data);
            } catch (err) {
                setError("Error loading hotel data");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfferByHotelId();
    }, [hotelId]); if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;
    if (!hotelData) return <p className="text-center">No hotel data available.</p>;

    const hotel = hotelData.hotel;
    const offers = hotelData.offers || [];

    return (<div className="bg-white text-gray-800 p-6 rounded-2xl max-w-5xl mx-auto shadow-md">
        <h2 className="text-2xl font-bold mb-2">{hotel?.name || "No name"}</h2>
        <p className="text-sm text-gray-600 mb-2">
            ID: {hotel.hotelId} | City: {hotel.cityCode} | Coordinates: {hotel.latitude}, {hotel.longitude}
        </p>

        {offers.map((offer, i) => (
            <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-t pt-4 mt-4"
            >                    <h3 className="text-lg font-semibold mb-2">Offer #{i + 1}</h3>
                <p><strong>Check-in:</strong> {offer.checkInDate}</p>
                <p><strong>Check-out:</strong> {offer.checkOutDate}</p>
                <p><strong>Price:</strong> {offer.price?.total} {offer.price?.currency}</p>
                <p><strong>Room type:</strong> {offer.room?.type}</p>
                <p><strong>Category:</strong> {offer.room?.typeEstimated?.category}</p>
                <p><strong>Beds:</strong> {offer.room?.typeEstimated?.beds}</p>
                <p><strong>Description:</strong> {offer.room?.description?.text}</p>
                <p><strong>Board type:</strong> {offer.boardType || "N/A"}</p>
                <p><strong>Guests:</strong> {offer.guests?.adults} adults</p>
                <p><strong>Payment policy:</strong> {offer.policies?.paymentType}</p>
                <p><strong>Link:</strong> <a href={offer.self} className="text-blue-600 underline" target="_blank" rel="noreferrer">Details</a></p>
            </motion.div>
        ))}
    </div>
    );
}
