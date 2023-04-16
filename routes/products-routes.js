const express = require("express");
const checkAuth = require("../middleware/check-auth");
const {
    createProduct,
    getMyProducts,
    getProductById,
    getAllProducts,
    deleteProduct,
} = require("../controllers/products-controller");

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/single/:id", getProductById);

router.use(checkAuth);

router.get("/myproducts/:id", getMyProducts);
router.post("/create", createProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
