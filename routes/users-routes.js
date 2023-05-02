const express = require("express");
const {
    login,
    register,
    getUser,
    verifyEmail
} = require("../controllers/users-controllers");

const router = express.Router();

router.get("/:id", getUser);
router.get("/verify/:id/:token", verifyEmail);

router.post("/login", login);
router.post("/register", register);

module.exports = router;
