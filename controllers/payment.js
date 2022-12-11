import { attributeValidator } from "../utils/attributeValidator.js"
import { allPayments, createPaymentOrder, paymentByPaymentId, refundPayment, refundPaymentList } from "../razorpay/index.js";
import { createError } from "../utils/error.js";
import { LoG } from "../logger/logger.js";
import { createServerOrder, serverPaymetByOrderId, serverPaymets, updateServerOrder } from "../database/operations.js";
import axios from "axios";
const logger = new LoG("Payment_Controller")


export const createOrder = async (req, res, next) => {
    const options = {
        amount: req.body.amount * 100,  // amount in the smallest currency unit
        currency: req.body.currency,
        order_id: req.body.order_id
    }
    const attr = attributeValidator(options);
    if (attr.success) {
        const order = await createPaymentOrder({ amount: options.amount, currency: options.currency })
        if (order.success) {
            createServerOrder({ order_id: order.order.id, user_order_id: options.order_id, amount: order.order.amount })
            res.status(201).send(order)
        } else {
            next(createError(order.statusCode, order.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const verifyPayment = async (req, res, next) => {
    const options = req.order
    const payment = await paymentByPaymentId(options.razorpay_payment_id)
    if (payment.success) {
        options["status"] = payment.payment.status
        const update = await updateServerOrder(options)
        res.status(200).send({ success: true, ...payment });
    }
    else {
        res.status(403).send({ success: false, ...payment });
    }

}

export const allPaymentsList = async (req, res, next) => {
    const options = {
        from: req.body.from,  // amount in the smallest currency unit
        to: req.body.to,
        count: req.query.limit,
        skip: req.query.page

    }
    const payments = await allPayments(options)
    if (payments.success) {
        res.status(200).send(payments)
    } else {
        next(createError(payments.statusCode, payments.error["description"]))
    }
}

export const payment = async (req, res, next) => {
    const paymentId = req.params.paymentId
    const attr = attributeValidator({ paymentId: paymentId });
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

export const refund = async (req, res, next) => {
    const paymentId = req.params.paymentId
    const attr = attributeValidator({ paymentId: paymentId });
    const options = {}
    if (req.body.amount) {
        options["amount"] = req.body.amount
    }
    if (req.body.speed) {
        options["speed"] = req.body.speed
    }
    if (attr.success) {
        const refund = await refundPayment(paymentId, options)
        if (refund.success) {
            res.status(201).send(refund)
        } else {
            next(createError(refund.statusCode, refund.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const refundList = async (req, res, next) => {
    const paymentId = req.params.paymentId
    const attr = attributeValidator({ paymentId: paymentId });
    const options = {}
    if (req.body.from) {
        options["from"] = req.body.from
    }
    if (req.body.to) {
        options["to"] = req.body.to
    }
    if (attr.success) {
        const refunds = await refundPaymentList(paymentId, options)
        if (refunds.success) {
            res.status(200).send(refunds)
        } else {
            next(createError(refunds.statusCode, refunds.error["description"]))
        }
    } else {
        next(createError(400, attr.message))
    }
}

export const serverPaymentsList = async (req, res, next) => {
    const options = {
        status: req.query.status,
        user_order_id: req.query.user_order_id,
        limit: req.query.limit,
        page: req.query.page
    }
    const payments = await serverPaymets(options)
    if (payments.success) {
        res.status(200).send(payments)
    } else {
        next(createError(payments.statusCode, payments?.error?.description))
    }
}

export const captureTrigger = async (req, res, next) => {
    try {
        const { payment } = req.body.payload
        const { entity } = payment
        const data = {
            razorpay_payment_id: entity.id,
            razorpay_order_id: entity.order_id,
            status: entity.status,
            method: entity.method
        }
        const { payments } = await serverPaymetByOrderId(data.razorpay_order_id)
        updateServerOrder(data)
        if (payments.length>0) {
            axios({
                url: "http://ec2-54-87-45-104.compute-1.amazonaws.com:8085/greenboys-api/api/v1/orders/confirm-payment",
                method:"patch",
                headers: {
                    key: "wgios89jkd8dbjlklksl==="
                },
                data: {
                    orderId: payments[0]?.user_order_id,
                    paymentMethod: data.method,
                    status:data.status
    
                }
            })
        }
        res.status(200).send()
    } catch (error) {
        next(error)
    }
}