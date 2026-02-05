const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventoryModel")
  const validate = {}

/* **************************
*  Validate Registration Data
* ************************** */
validate.classificationRules = () => {
    return [
        // Classification name is required and must be string
        body("classificationName")
            .trim()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Classification name is required.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification names cannot contain spaces or special characters.")
            .escape(),
        // Classification name must be unique
        body("classificationName")
            .custom(async (classificationName) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classificationName)
                if (classificationExists) {
                    throw new Error("Classification name already exists.")
                }
            }),
    ]
}



/* **************************
*  Check data and return errors or continue to register account
* ************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classificationName } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classificationName,
        })
        return
    }
    next()
}

module.exports = validate
