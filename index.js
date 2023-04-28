const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRoutes = require("./routes/users-routes");
const productsRoutes = require("./routes/products-routes");
const bidsRoutes = require("./routes/bids-routes");

const app = express();
require("dotenv").config();

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).send("Start Up");
});

app.use("/api/user", usersRoutes);
app.use("/api/product", productsRoutes);
app.use("/api/bid", bidsRoutes);

app.use((error, req, res, next) => {
    console.log(error.message)
    res.status(error.code || 500).json({
        message: error.message || "Unknown Error Occurred",
    });
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log("Server Running on Port 5000");
        });
    })
    .catch((err) => {
        console.log(err);
    });
