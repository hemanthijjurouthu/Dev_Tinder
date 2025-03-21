const express = require('express');
const paymentRouter = express.Router();
const instance = require('./razorpay');
const { userAuth } = require('../MiddleWares/userAuth');
const Payment = require('../Models/paymentModel');
const User = require('../Models/User');
const {membershipAmount} = require('../utils/constants');
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    const {membershipType} = req.body;
    const {firstName,lastName,emailId} = req.user;
    try {
        const order = await instance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType,
            },
        });

        //save the order to database
        const payment = new Payment({
            userId : req.user._id,
            orderId : order.id,
            status : order.status,
            amount : order.amount,
            currency : order.currency,
            notes : order.notes,
        })
        const savedPayment = await payment.save();

        //return back the order to the frontend

        res.status(201).json({ ...savedPayment.toJSON(),keyId : process.env.RAZORPAY_KEY_ID});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

paymentRouter.post('/payment/webhook', async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body), 
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            return res.status(400).send("Webhook is not valid!!!");
        }

        // Update the payment status in DB
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

        if (!payment) {
            return res.status(404).send("Payment record not found.");
        }

        payment.status = paymentDetails.status;
        await payment.save();

        // Update the user as premium
        const user = await User.findOne({ _id: payment.userId });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        res.status(200).send("Webhook processed successfully.");
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
});


module.exports = paymentRouter;
