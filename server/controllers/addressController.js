import Address from "../models/Address.js";


// add address
export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body;
        await Address.create({
            ...address,
            userId
        });

        return res.json({ success: true, message: "Address added successfully"});
    } catch (error) {
        console.error("Error in addAddress function in addressController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}


// get address
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const addresses = await Address.find({ userId });
        return res.json({ success: true, addresses });
    } catch (error) {
        console.error("Error in getAddress function in addressController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}