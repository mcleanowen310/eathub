const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Home page displaying all burgers
app.get("/", (req, res) => {
  let ep = `http://localhost:4000/burgers/`;

  axios.get(ep).then((response) => {
    let bdata = response.data;
    res.render("home", { titletext: "burgers", bdata });
  });
});

// Getting burger details
app.get("/buy", (req, res) => {
  let item_id = req.query.item;
  let endp = `http://localhost:4000/burgers/${item_id}`;

  axios.get(endp).then((response) => {
    let burgerData = response.data.data; // Access the `data` property of `response.data`

    res.render("buy", { titletext: "Buy Burger", burgerData });
  });
});

// Posting a new burger
app.get("/add", (req, res) => {
  res.render("create");
});

app.post("/add", (req, res) => {
  let burgertitle = req.body.title;
  let burgerprice = req.body.price;
  let burgertype = req.body.type_id;

  const insertdata = {
    burgerField: burgertitle,
    priceField: burgerprice,
    type_id: burgertype,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // this line is for API security
      "x-api-key": `554400`,
    },
  };

  let endpoint = "http://localhost:4000/burgers/add";

  axios.post(endpoint, insertdata, config).then((response) => {
    if (response.data.respObj) {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;
      // this line is for API security
      console.log(response.data.respObj);
      res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
    } else {
      res.send(
        "No response object found in the data, please refresh and try again."
      );
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`Web server started on port :  ${server.address().port}`);
});
