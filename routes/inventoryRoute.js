const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const detailController = require("../controllers/detailController")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", detailController.buildByInventoryId);

module.exports = router;