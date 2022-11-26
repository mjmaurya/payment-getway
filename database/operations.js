import { pool } from "./connection.js"


export const createServerOrder=async(order)=>{
    try {
        return new Promise((resolve)=>{
            pool.query(`insert into grinzy_dev.payment(order_id,user_order_id) values('${order.order_id}',${order.user_order_id})`,(err,result)=>{
                if (err) {
                    resolve({success:false,...err})
                } else {
                    resolve({success:true,...result})
                }
            })
        })
    } catch (error) {
        return({success:false,...error})
    }
}

export const updateServerOrder=async(order)=>{
    try {
        return new Promise((resolve)=>{
            pool.query(`update grinzy_dev.payment set payment_id='${order.razorpay_payment_id}', payment_status='${order.status}',payment_signature='${order.razorpay_signature}' where order_id='${order.razorpay_order_id}'`,(err,result)=>{
                if (err) {
                    resolve({success:false,...err})
                } else {
                    resolve({success:true,...result})
                }
            })
        })
    } catch (error) {
        return({success:false,...error})
    }
}