const express=require("express");
const checkAuth = require("../middleware/check-auth");
const { addBid, deleteBid, getMyBids } = require("../controllers/bids-controllers");

const router=express.Router();

router.use(checkAuth);

router.get("/:id",getMyBids);
router.post("/create",addBid);
router.delete("/delete/:id",deleteBid);

module.exports=router;