import mysql from 'mysql'
export const pool= mysql.createPool({
    connectionLimit: 5,
    host: 'grinzy.cw3yknivdrs8.us-east-1.rds.amazonaws.com',
    port:3306,
    user: 'pkmuntu',
    password: 'Muntupk123'
})