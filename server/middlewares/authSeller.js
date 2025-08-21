import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
    const {sellerToken} = req.cookies;
    if (!sellerToken) {
        return res.json({ success: false, message: "Unauthorized access" });
    }

    try{
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if(decoded.email === process.env.SELLER_EMAIL) {
            next();
        } else{
            return res.json({ success: false, message: "Forbidden: Invalid seller credentials" });
        }
    } catch (error) {
        console.error("Error in authSeller middleware");
        return res.status(401).json({ success: false, message: error.message });
    }
}

export default authSeller;