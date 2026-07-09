import express from "express";
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus,deleteOrder } from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import { get } from "mongoose";

const router = express.Router();

router.route("/")
.post(protect, createOrder)
.get(protect, admin,getAllOrders);

router.get("/myorders", protect, getMyOrders)
router.delete("/:id", protect, admin,deleteOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect,admin, updateOrderStatus);

export default router;