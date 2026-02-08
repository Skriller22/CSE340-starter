const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const detailController = require("../controllers/detailController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/add-classification-validation")
const invAddValidate = require("../utilities/add-inventory-validation")
const invUpdateValidate = require("../utilities/update-inventory-validation")

// Build inventory manageemnt
router.get("/", utilities.handleErrors(invController.buildInventoryManagementView));
// Get Inventory JSON for management view table
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// Build the edit page for individual management by inventory ID
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventoryView));
// Build add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));
// Build add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));
// Build inventory view by classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Build inventory view for individual inventory items
router.get("/detail/:inventoryId", utilities.handleErrors(detailController.buildByInventoryId));
// Post form submission for adding classification
router.post("/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    invController.addClassification
);
// Post form submissions for adding inventory
router.post("/add-inventory",
    invAddValidate.inventoryRules(),
    invAddValidate.checkInventoryData,
    invController.addInventory
);
// Post form submission for updating inventory
router.post("/update",
    invAddValidate.inventoryRules(),
    invUpdateValidate.checkInventoryUpdateData,
    invController.updateInventory
)

module.exports = router;