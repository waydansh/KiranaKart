import Order from "../models/order.js";
import Product from "../models/product.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// initialize razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// place order COD
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Address and items are required" });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.price * item.quantity;
        }, 0);

        // add tax 2%
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            isPaid: false,
        });

        return res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error("Error in placeOrderCOD:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

// 🔹 Step 1: Create Razorpay order
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Address and items are required" });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.price * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02);

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // create order in DB but unpaid
        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            isPaid: false,
            razorpayOrderId: order.id,
        });

        return res.json({ success: true, order, newOrder });
    } catch (error) {
        console.error("Error in placeOrderRazorpay:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

// 🔹 Step 2: Verify Razorpay payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // update order status
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { isPaid: true, razorpayPaymentId: razorpay_payment_id }
            );

            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error in verifyPayment:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

// get order by user id
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getUserOrders:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

// get all orders for seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getAllOrders:", error.message);
        return res.json({ success: false, message: error.message });
    }
};
