import jwt from 'jsonwebtoken';

// seller login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
            return res.json({ success: false, message: "Invalid seller credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // adjust based on your environment
            // prevents client-side access to the cookie
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiration time
        });

        return res.json({ success: true, message: "Seller logged in successfully" });
    } catch (error) {
        console.log("error in sellerLogin function in sellerController.js");
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// seller isAuth 
export const isSellerAuth = (req, res) => {
    try {
        return res.json({ success: true, message: "Seller is authenticated" });
    } catch (error) {
        console.error("Error in isSellerAuth function in sellerController.js");
        return res.json({ success: false, message: error.message });
    }
}

// seller logout
export const sellerLogout = (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict'
        });
        return res.json({ success: true, message: "Seller logged out successfully" });
    } catch (error) {
        console.error("Error in sellerLogout function in sellerController.js");
        return res.json({ success: false, message: error.message });
    }
}