import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded?.id) {
            req.user = { id: decoded.id };
            next();
        } else {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
    } catch (error) {
        console.error("Error in authUser middleware:", error.message);
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }
};

export default authUser;