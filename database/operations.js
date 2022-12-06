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

export const serverPaymets=async(option)=>{
    const query={
        status:undefined,
        user_order_id:undefined
    }
    if (option.status) {
        query["status"]=`payment_status='${option.status}'`
    }
    if (option.user_order_id) {
        query["user_order_id"]=`user_order_id=${option.user_order_id}`
    }
    try {
        const dbQuery=`SELECT * FROM grinzy_dev.payment where ${query.status??'payment_status is not null'} 
        and ${query.user_order_id??'user_order_id is not null'}
        LIMIT ${option.limit?option.limit:10} OFFSET ${option.page?(option.page-1)*option.limit:0}`;
        return new Promise((resolve)=>{
            pool.query( dbQuery,
            (err,result)=>{
                if (err) {
                    resolve({success:false,...err})
                } else {
                    resolve({success:true,...{payments:result}})
                }
            })
        })
    } catch (error) {
        console.log("catch Error=",error);
        return({success:false,...error})
    }
}