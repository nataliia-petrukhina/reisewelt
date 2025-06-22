import mongoose from 'mongoose';

const HotelOfferSchema = new mongoose.Schema({
    type: String,
    hotel: {
        _type: String,
        hotelId: String,
        chainCode: String,
        dupeId: String,
        name: String,
        cityCode: String,
        latitude: Number,
        longitude: Number
    },
    available: Boolean,
    self: String,
    offers: [{
        id: String,
        checkInDate: Date,
        checkOutDate: Date,
        rateCode: String,
        rateFamilyEstimated: {
            code: { type: String, default: '' },
            type: { type: String, default: '' }
        },
        boardType: { type: String, default: '' },
        category: { type: String, default: '' },
        commission: {
            percentage: { type: String, default: '' }
        },
        description: {
            text: { type: String, default: '' },
            lang: { type: String, default: '' }
        },
        room: {
            type: { type: String, default: '' },
            typeEstimated: {
                category: { type: String, default: '' },
                beds: { type: Number, default: 0 },
                bedType: { type: String, default: '' }
            },
            description: {
                text: { type: String, default: '' },
                lang: { type: String, default: '' }
            }
        },
        roomInformation: {
            description: { type: String, default: '' },
            type: { type: String, default: '' },
            typeEstimated: {
                bedType: { type: String, default: '' },
                beds: { type: Number, default: 0 },
                category: { type: String, default: '' }
            },
            name: {
                text: { type: String, default: '' }
            },
            maxPersonCapacity: {
                total: { type: Number, default: 0 },
                adults: { type: Number, default: 0 },
                children: { type: Number, default: 0 }
            }
        },
        guests: {
            adults: { type: Number, default: 1 }
        },
        price: {
            currency: { type: String, default: '' },
            base: { type: String, default: '' },
            total: { type: String, default: '' },
            taxes: [mongoose.Schema.Types.Mixed],
            variations: {
                average: {
                    base: { type: String, default: '' }
                },
                changes: [{
                    startDate: Date,
                    endDate: Date,
                    base: { type: String, default: '' }
                }]
            }
        },
        policies: {
            cancellations: [{
                description: {
                    text: { type: String, default: '' }
                },
                policyType: { type: String, default: '' },
                numberOfNights: { type: Number, default: 0 },
                deadline: { type: Date, default: null },
                amount: { type: String, default: '' }
            }],
            guarantee: mongoose.Schema.Types.Mixed,
            holdTime: mongoose.Schema.Types.Mixed,
            paymentType: { type: String, default: '' },
            refundable: {
                cancellationRefund: { type: String, default: '' }
            }
        },
        self: { type: String, default: '' }
    }]
});

mongoose.models.HotelOffer && delete mongoose.models.HotelOffer;
export default mongoose.model('HotelOffer', HotelOfferSchema);
