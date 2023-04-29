const express=require("express");
const { getNotificationsById, addNotification, deleteNotification } = require("../controllers/notifications-controllers");
const checkAuth = require("../middleware/check-auth");

const router=express.Router();

router.use(checkAuth);

router.get("/:id",getNotificationsById);
router.post("/create",addNotification);
router.delete("/:index",deleteNotification);

module.exports=router;