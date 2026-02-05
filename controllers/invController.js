const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    if (data.length === 0) {
        res.render("./inventory/classification", {
            title: "No Vehicles Found",
            nav,
            grid,
        })
        return
    } else {
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " Vehicles",
            nav,
            grid,
        })
    }
}

/* ***************************
 * Build inventory table view
 * ************************** */
invCont.buildInventoryTable = async function (req, res, next) {
    const data = await invModel.getAllInventory()
    const inventoryTable = await utilities.buildInventoryTable(data)
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        inventoryTable,
    })
}

/* ***************************
*  Build classification management view
* ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ***************************
*  Post new classification
* ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classificationName } = req.body
    try {
        const addClassResult = await invModel.addClassification(classificationName)
        if (addClassResult.rowCount > 0) {
            req.flash("notice-success", `The classification ${classificationName} was added successfully.`)
            res.redirect("/inv/")
        } else {
            req.flash("notice", "Sorry, the classification could not be added.")
            res.redirect("/inv/add-classification")
        }
    } catch (error) {
        console.error("addClassification error " + error)
        next(error)
    }
}

/* ***************************
*  Build inventory management view
* ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const addInventoryView = await utilities.buildAddInventoryView()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        addInventoryView,
        errors: null,
    })
}

/* ***************************
*  Post new inventory item
* ************************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    try {
        const addInvResult = await invModel.addInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        )
        if (addInvResult.rowCount > 0) {
            req.flash("notice-success", `The vehicle ${inv_make} ${inv_model} was added successfully.`)
            res.redirect("/inv/")
        } else {
            const addInventoryView = await utilities.buildAddInventoryView()
            req.flash("notice", "Sorry, the vehicle could not be added.")
            res.render("./inventory/add-inventory", {
                title: "Add Inventory",
                nav,
                addInventoryView,
                errors: null,
            })
        }
    } catch (error) {
        console.error("addInventory error " + error)
        const nav = await utilities.getNav()
        const addInventoryView = await utilities.buildAddInventoryView()
        req.flash("notice", "Sorry, the vehicle could not be added.")
        res.render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            addInventoryView,
            errors: [{ msg: error.message }],
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */

module.exports = invCont