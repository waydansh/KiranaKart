import User from "../models/User.js";


// update user cartdata


export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;
        await User.findByIdAndUpdate(userId, { cartItems });
        return res.json({ success: true, message: "Cart updated successfully" });

    } catch (error) {
        console.error("Error in updateCart function in cartController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}