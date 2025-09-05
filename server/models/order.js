import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'user'
    },
    items: [{
        product: {
            type: String,
            required: true,
            ref: 'product'
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
        ref: 'address'
    },
    status: {
        type: String,
        default: 'order placed'
    },
    paymentType: {
        type: String,
        enum: ["COD", "Online"],
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
}, {
    timestamps: true
});

const Order = mongoose.model("order", orderSchema);

export default Order;