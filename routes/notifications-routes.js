const express=require("express");
const { getNotificationsById } = require("../controllers/notifications-controllers");
const checkAuth = require("../middleware/check-auth");

const router=express.Router();

router.use(checkAuth);

router.get("/:id",getNotificationsById);

module.exports=router;