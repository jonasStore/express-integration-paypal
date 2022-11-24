import  sql from '../config/db.js';

const Transaction = function(trans) {
    this.name           = trans.name;
    this.email          = trans.email;
    this.purchase_date  = trans.purchase_date;
    this.amount         = trans.amount;
    this.product_id     = trans.product_id;
}

Transaction.create = (newTrans, result) => {
    sql.query("INSERT INTO transactions SET ?", newTrans, (err, res) => {
        if(err){
            console.log("Error:\n", err);
            result(err, null);
            return;
        }

        console.log("created Transaction:\n", {id: res.insertId, ...newTrans});
        result(null, {id: res.insertId, ...newTrans});
    });
}

export default Transaction;