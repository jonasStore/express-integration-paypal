import mysql, { createPool } from "mysql";


var connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.getConnection((err, connection) => {
  if(err){
    console.log(err);
    throw Error("MySQL disconnected...");
  }
  console.log('MySQL connected...');
})

export default connection;