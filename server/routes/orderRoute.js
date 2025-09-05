import express from "express";
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazorpay, verifyPayment } from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verify', authUser, verifyPayment)
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);

export default orderRouter;