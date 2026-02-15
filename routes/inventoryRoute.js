const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const detailController = require("../controllers/detailController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/add-classification-validation")
const invAddValidate = require("../utilities/add-inventory-validation")
const invUpdateValidate = require("../utilities/update-inventory-validation")
const protected = (utilities.checkLogin)
// Optional middleware for employee only pages
const employeeOnly = [utilities.checkEmployee]
// Optional middleware for admin only pages
const adminOnly = [utilities.checkAdmin]

// Build inventory manageemnt
router.get("/", protected, employeeOnly, utilities.handleErrors(invController.buildInventoryManagementView));
// Get Inventory JSON for management view table
router.get("/getInventory/:classification_id", protected, employeeOnly, utilities.handleErrors(invController.getInventoryJSON));
// Build the edit page for individual management by inventory ID
router.get("/edit/:inventoryId", protected, employeeOnly, utilities.handleErrors(invController.buildEditInventoryView));
// Build Delete inventory item comfirmation/view
router.get("/delete/:inventoryId", protected, employeeOnly, utilities.handleErrors(invController.buildDeleteInventoryView));
// Build add classification form
router.get("/add-classification", protected, employeeOnly, utilities.handleErrors(invController.buildAddClassificationView));
// Build delete classification confirmation view
router.get("/delete-classification/:classificationId", protected, adminOnly, utilities.handleErrors(invController.buildDeleteClassificationView));
// Build add inventory form
router.get("/add-inventory", protected, employeeOnly, utilities.handleErrors(invController.buildAddInventoryView));
// Build inventory view by classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Build inventory view for individual inventory items
router.get("/detail/:inventoryId", utilities.handleErrors(detailController.buildByInventoryId));

// Post form submission for adding classification
router.post("/add-classification",
    protected, employeeOnly,
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    invController.addClassification
);
// Post form submissions for adding inventory
router.post("/add-inventory",
    protected, employeeOnly,
    invAddValidate.inventoryRules(),
    invAddValidate.checkInventoryData,
    invController.addInventory
);
// Post form submission for updating inventory
router.post("/update",
    protected, employeeOnly,
    invAddValidate.inventoryRules(),
    invUpdateValidate.checkInventoryUpdateData,
    invController.updateInventory
)
//  Post positive confirmation for deleting inventory item
router.post("/delete-confirmed",
    protected, employeeOnly, adminOnly,
    invController.deleteInventory
)

// Delete classification
router.post("/delete-classification", 
    protected, adminOnly,
    utilities.handleErrors(invController.deleteClassification)
);

module.exports = router;