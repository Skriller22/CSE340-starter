const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const detailController = require("../controllers/detailController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/add-classification-validation")
const invValidate = require("../utilities/add-inventory-validation")

router.get("/", invController.buildInventoryTable);
router.get("/add-classification", invController.buildAddClassificationView);
router.get("/add-inventory", invController.buildAddInventoryView);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", detailController.buildByInventoryId);
router.post("/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    invController.addClassification
);
router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
);

module.exports = router;