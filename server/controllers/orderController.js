import Order from "../models/order.js";
import Product from "../models/product.js";


// place order COD
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.lenght === 0) {
            return res.json({ success: false, message: "Address and items are required" });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + (product.price * item.quantity);
        }, 0);

        // add tax 2%
        amount += (amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
        });

        return res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error("Error in placeOrder function in orderController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// get order by user id
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" },
            { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getOrdersByUserId function in orderController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// get all orders for seller
export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            $or: [{ paymentType: "COD" },
            { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 });
        
        return res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getAllOrders function in orderController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}