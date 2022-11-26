import Razorpay from 'razorpay';
import { config } from '../config/testing.js';

       const instance = new Razorpay({
            key_id: config.razorpay.KEY_ID,
            key_secret: config.razorpay.KEY_SECRET,
          });
    
    
  export  const createPaymentOrder=async(options)=>{
       try {
        return new Promise((resolve) => {
            instance.orders.create(options, function(err, order) {
                if (err) {
                    resolve({success:false,...err})
                }else{
                    resolve({success:true,...{order:order}})
                }
              });
        })
       } catch (error) {
        return {success:false,...error}
       }
    }

export const allPayments=async(options)=>{
    try {
        return new Promise((resolve)=>{
            instance.payments.all(options,(err,payments)=>{
                if (err) {
                    resolve({success:false,...err})
                } else {
                    resolve({success:true,...{payments:payments}})
                }
            })
        })
    } catch (error) {
        resolve({success:false,...error})
    }
}


export const paymentByPaymentId=async(paymentId)=>{
    try {
        const payment= await instance.payments.fetch(paymentId);
        return ({success:true,...{payment:payment}})
    } catch (error) {
        return({success:false,...error})
    }
}

export const refundPayment=async(paymentId,options)=>{
    try {
        const refund= await instance.payments.refund(paymentId,options)
        return ({success:true,...{refund:refund}})
    } catch (error) {
        return({success:false,...error})
    }
}
export const refundPaymentList=async(paymentId,options)=>{
    try {
        const refunds= await instance.payments.fetchMultipleRefund(paymentId,options)
        return ({success:true,...{refunds:refunds}})
    } catch (error) {
        return({success:false,...error})
    }
}