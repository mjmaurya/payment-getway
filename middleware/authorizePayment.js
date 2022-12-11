import { attributeValidator } from "../utils/attributeValidator.js";
import crypto from 'crypto';
import { config } from "../config/testing.js";
export const authorizePayment = (req, res, next) => {
    const options = {
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_signature: req.body.razorpay_signature
    }
    let attr = attributeValidator(options);
    if (attr.success) {
        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', config.razorpay.KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        if (expectedSignature !== req.body.razorpay_signature) {
            next(createError(400, "Unauthorized Payment "))
        }
    } else {
        next(createError(400, attr.message))
    }
    req.order=options;
    next()
}