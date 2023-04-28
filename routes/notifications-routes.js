const express=require("express");
const { getNotificationsById, addNotification } = require("../controllers/notifications-controllers");
const checkAuth = require("../middleware/check-auth");

const router=express.Router();

router.use(checkAuth);

router.get("/:id",getNotificationsById);
router.post("/create",addNotification);

module.exports=router;