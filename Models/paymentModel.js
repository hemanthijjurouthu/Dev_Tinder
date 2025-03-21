const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentId: {
        type: String,
        default: null,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
        },
        membershipType : {
            type : String,
        }
    }
}, { timestamps: true });


const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;