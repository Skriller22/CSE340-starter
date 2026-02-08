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
 * Return Inventory by Classification as JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next)  {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 * Build full management view
 * ************************** */
invCont.buildInventoryManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classData = await invModel.getClassifications()
    const classificationSelect = await utilities.buildClassificationList(classData.rows)
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
    })
}

/* ***************************
*  Build inventory management edit view
* ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inventoryId)
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const item = itemData[0]
    const classData = await invModel.getClassifications()
    const classificationSelect = await utilities.buildClassificationList(classData.rows)
    const itemName = `${item.inv_make} ${item.inv_model}`
    const editInventoryView = await utilities.buildEditInventoryView(item)
    res.render("./inventory/edit-inventory", {
        title: "Edit: " + itemName,
        nav,
        editInventoryView,
        classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}


/* ***************************
*  Build add classification management view
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
*  Post updated inventory item
* ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
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
        const updateInvResult = await invModel.updateInventory(
            inv_id,
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
        if (updateInvResult.rowCount > 0) {
            req.flash("notice-success", `The vehicle ${inv_make} ${inv_model} was updated successfully.`)
            res.redirect("/inv/")
        } else {
            // Update failed — reload form
            const itemData = await invModel.getInventoryByInventoryId(inv_id)
            const item = itemData[0]
            const classData = await invModel.getClassifications()
            const classificationSelect = await utilities.buildClassificationList(classData.rows)

            res.render("./inventory/edit-inventory", {
                title: "Edit " + item.inv_make + " " + item.inv_model,
                nav,
                editInventoryView: await utilities.buildEditInventoryView(item),
                classificationSelect,
                errors: [{ msg: "Update failed." }],
                ...item
            })
        }
    } catch (error) {
        console.error("editInventory error " + error)
        const nav = await utilities.getNav()
        const itemData = await invModel.getInventoryByInventoryId(req.body.inv_id)
        const item = itemData[0]
        const classData = await invModel.getClassifications()
        const classificationSelect = await utilities.buildClassificationList(classData.rows)
        res.render("./inventory/edit-inventory", {
            title: "Edit " + item.inv_make + " " + item.inv_model,
            nav,
            editInventoryView: await utilities.buildEditInventoryView(item),
            classificationSelect,
            errors: [{ msg: error.message }],
            ... item
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */

module.exports = invCont