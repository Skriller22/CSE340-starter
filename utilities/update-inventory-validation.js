const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventoryModel")
  const validate = {}

/* **************************
*  Validate Registration Data
* ************************** */

// Refer to add inventory validation for these rules

/* **************************
*  Check data and return errors or continue to update inventory item
* ************************** */
validate.checkInventoryUpdateData = async (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const itemData = await inventoryModel.getInventoryByInventoryId(req.body.inv_id)
        const item = itemData[0]
        const editInventoryView = await utilities.buildEditInventoryView(item)

        res.render("./inventory/edit-inventory", {
            title: "Edit " + item.inv_make + " " + item.inv_model,
            nav,
            editInventoryView,
            errors
        })
        return
    }
    next()
}

module.exports = validate
