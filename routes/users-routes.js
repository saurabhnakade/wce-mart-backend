const express = require("express");
const {
    login,
    register,
    getUser,
} = require("../controllers/users-controllers");

const router = express.Router();

router.get("/:id", getUser);

router.post("/login", login);
router.post("/register", register);

module.exports = router;
