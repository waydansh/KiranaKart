import express from "express";
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCOD } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/user', authUser, getUserOrders);
orderRouter.get('/seller', authUser, getAllOrders);

export default orderRouter;