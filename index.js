const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRoutes = require("./routes/users-routes");
const productsRoutes = require("./routes/products-routes");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/user", usersRoutes);
app.use("/api/product", productsRoutes);

mongoose
    .connect(
        "mongodb+srv://saurabh:saurabh23@cluster0.t6qudft.mongodb.net/test?retryWrites=true&w=majority"
    )
    .then(() => {
        app.listen(5000, () => {
            console.log("Server Running on Port 5000");
        });
    })
    .catch((err) => {
        console.log(err);
    });
