import "dotenv/config";
import express from "express";
import * as paypal from "./config/paypal-api.js";
import Transaction from './models/transaction.js';

var transactions = [];

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// render checkout page with client id & unique client token
app.get("/", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  try {

    const clientToken = await paypal.generateClientToken();
    res.render("checkout", { clientId, clientToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
app.post("/api/orders", async (req, res) => {
  try {
    let purchase_units = [{
      amount: {
        currency_code: "USD",
        value: "1.00",
        breakdown:{
          item_total: {
            currency_code: "USD",
            value: "1.00"
          }
        }
      },
      items: [
        // {
        //   "name": "Redhock Bar Soap",
        //   "sku": "001",
        //   "price": "1.00",
        //   "currency": "USD",
        //   "quantity": 1
        // },
        {
          name: 'product1',
          quantity: '2',
          unit_amount: {
            currency_code: "USD",
            value: '0.50'
          }
        },
        // {
        //   name: 'product2',
        //   quantity: '4',
        //   unit_amount: {
        //     currency_code: "USD",
        //     value: '10.00'
        //   },
        //   category: 'category2'
        // },
        // {
        //   name: 'product3',
        //   quantity: '6',
        //   unit_amount: {
        //     currency_code: "USD",
        //     value: '5.00'
        //   },
        //   category: 'category3'
        // }
      ]
    }];
    const order = await paypal.createOrder(purchase_units);
    res.json(order);
    console.log("order\n", order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await paypal.capturePayment(orderID);
    const amount = captureData.gross_total_amount.value;
    const item = captureData.purchase_units[0].items[0] ;
    const purchase_date = captureData.update_time;
    console.log("capture\n", captureData, item);
    if(true){
      const newTransaction = new Transaction({
        'name': 'dev',
        'email': 'dev@gmail.com',
        'purchase_date': purchase_date,
        'amount': amount,
        'product_id': item.name // not product_id, change yourself
      });
      Transaction.create(newTransaction, (err, data) => {
        if(err){
          throw Error("here",err);
        }
        return res.json(captureData);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.listen(process.env.PORT);
