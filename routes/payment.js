import express from 'express';
import { allPaymentsList, createOrder, payment, refund, refundList, verifyPayment } from '../controllers/payment.js';
import { authorizePayment } from '../middleware/authorizePayment.js';

const router = express.Router()
router.post("/create/orderId",createOrder);
router.post("/verify",authorizePayment,verifyPayment);
router.get("/payments",allPaymentsList)
router.get("/payments/:paymentId",payment)
router.get("/payments/:paymentId/refund",refund)
router.get("/payments/:paymentId/refunds",refundList)
    
   

export default router;