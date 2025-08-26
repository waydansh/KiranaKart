import User from "../models/User.js";


// update user cartdata

// old before chatgpt
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.user.id
        await User.findByIdAndUpdate(userId, { cartItems });
        return res.json({ success: true, message: "Cart updated successfully" });

    } catch (error) {
        console.error("Error in updateCart function in cartController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// export const updateCart = async (req, res) => {
//     try {
//         const { cartItems } = req.body;
//         const userId = req.user.id

//         // console.log(req.user)
//         // console.log(userId)

//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { cartItems },
//         );

//         if (!updatedUser) {
//             return res.json({ success: false, message: `User not found for userId ${userId}` });
//         }

//         return res.json({
//             success: true,
//             message: "Cart updated successfully",
//             user: updatedUser   // 👈 return updated user so frontend stays in sync
//         });
//     } catch (error) {
//         console.error("Error in updateCart function in cartController.js");
//         return res.json({ success: false, message: error.message });
//     }
// };



