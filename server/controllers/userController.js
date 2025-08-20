import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//register user
export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            cartItems: {}
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // prevents client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // adjust based on your environment
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiration time
        });

        return res.json({ success: true, message: "User registered successfully", user: { email: user.email, name: user.name } });
    } catch (error) {
        console.log("error in register function in userController.js");
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // prevents client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // adjust based on your environment
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiration time
        });

        return res.json({ success: true, message: "User logged in successfully", user: { email: user.email, name: user.name } });
    } catch (error) {
        console.log("error in login function in userController.js");
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// check auth
export const isAuth = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        return res.json({ success: true, user });

    } catch(error) {
        console.log("error in isAuth function in userController.js");
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}

// logout user
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict'
        });
        return res.json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.log("error in logout function in userController.js");
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}