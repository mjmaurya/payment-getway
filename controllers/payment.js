import { attributeValidator } from "../utils/attributeValidator.js"
import { allPayments, createPaymentOrder, paymentByPaymentId, refundPayment, refundPaymentList } from "../razorpay/index.js";
import { createError } from "../utils/error.js";
import { LoG } from "../logger/logger.js";
import { createServerOrder, serverPaymets, updateServerOrder } from "../database/operations.js";
const logger = new LoG("Payment_Controller")


export const createOrder = async (req, res, next) => {
    const options = {
        amount: req.body.amount * 100,  // amount in the smallest currency unit
        currency: req.body.currency,
        order_id:req.body.order_id
    }
    const attr = attributeValidator(options);
    if (attr.success) {
        const order = await createPaymentOrder({amount:options.amount,currency:options.currency})
        if (order.success) {
            createServerOrder({order_id:order.order.id,user_order_id:options.order_id})
            res.status(201).send(order)
        } else {
            next(createError(order.statusCode, order.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const verifyPayment =async(req, res, next) => {
    const options = req.order
        const payment= await paymentByPaymentId(options.razorpay_payment_id)
        console.log(payment);
        if (payment.success) {
            options["status"]=payment.payment.status
           const update=await updateServerOrder(options)
            res.status(200).send({ success: true,...payment });
        }
        else {
            res.status(403).send({ success: false,...payment });
        }

}

export const allPaymentsList=async (req, res, next) => {
    const options = {
        from: req.body.from,  // amount in the smallest currency unit
        to: req.body.to,
        count:req.query.limit,
        skip:req.query.page

    }
        const payments = await allPayments(options)
        if (payments.success) {
            res.status(200).send(payments)
        } else {
            next(createError(payments.statusCode, payments.error["description"]))
        }
}

export const payment=async (req, res, next) => {
      const  paymentId= req.params.paymentId
    const attr = attributeValidator({paymentId:paymentId});
    if (attr.success) {
        const payments = await paymentByPaymentId(paymentId)
        if (payments.success) {
            res.status(200).send(payments)
        } else {
            next(createError(payments.statusCode, payments.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const refund=async  (req, res, next) => {
    const  paymentId= req.params.paymentId
    const attr = attributeValidator({paymentId:paymentId});
    const options={}
    if (req.body.amount) {
        options["amount"]=req.body.amount
    }
    if (req.body.speed) {
        options["speed"]=req.body.speed
    }
    if (attr.success) {
        const refund = await refundPayment(paymentId,options)
        if (refund.success) {
            res.status(201).send(refund)
        } else {
            next(createError(refund.statusCode, refund.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const refundList=async  (req, res, next) => {
    const  paymentId= req.params.paymentId
    const attr = attributeValidator({paymentId:paymentId});
    const options={}
    if (req.body.from) {
        options["from"]=req.body.from
    }
    if (req.body.to) {
        options["to"]=req.body.to
    }
    if (attr.success) {
        const refunds = await refundPaymentList(paymentId,options)
        if (refunds.success) {
            res.status(200).send(refunds)
        } else {
            next(createError(refunds.statusCode, refunds.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const serverPaymentsList=async (req, res, next) => {
    const options = {
        status: req.query.status,
        user_order_id:req.query.user_order_id,
        limit: req.query.limit,
        page:req.query.page
    }
        const payments = await serverPaymets(options)
        if (payments.success) {
            res.status(200).send(payments)
        } else {
            next(createError(payments.statusCode, payments?.error?.description))
        }
}