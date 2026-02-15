const {body, validationResult} = require("express-validator")
const utilities = require(".")

const validate = {}

/* **************************
 * Validate Custom Order Data
 * ************************** */

validate.customOrderRules = () => {
    return [
        // Custom order make is required and must be string
        body("order_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2, max: 50 })
            .withMessage("Vehicle make is required and cannot exceed 50 characters."),

        // Vehicle model is required and must be string
        body("order_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1, max: 50 })
            .withMessage("Vehicle model is required and cannot exceed 50 characters."),

        // Vehicle year is required and must be a valid year
        body("order_year")
            .trim()
            .notEmpty()
            .matches(/^(19|20)\d{2}$/)
            .withMessage("Vehicle year is required and must be a valid year.")
            .custom((value) => {
                const year = parseInt(value)
                const currentYear = new Date().getFullYear()
                if (year < 1886 || year > currentYear + 1) {
                    throw new Error(`Vehicle year must be between 1886 and ${currentYear + 1}.`)
                }
                return true
            }),

        // Color is required - accepts hex colors or named colors
        body("order_color")
            .trim()
            .notEmpty()
            .withMessage("Vehicle color is required.")
            .custom((value) => {
                // Check if it's a valid hex color (#RGB or #RRGGBB)
                const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                
                // List of common named colors for reference
                const namedColors = [
                    'red', 'blue', 'black', 'white', 'silver', 'green', 'yellow', 'orange', 
                    'purple', 'brown', 'gray', 'beige', 'gold', 'maroon', 'crimson', 'scarlet',
                    'navy', 'teal', 'turquoise', 'cyan', 'aqua', 'lime', 'olive', 'salmon',
                    'coral', 'tomato', 'khaki', 'tan', 'chocolate', 'peru', 'goldenrod',
                    'sienna', 'indigo', 'violet', 'plum', 'orchid', 'magenta', 'fuchsia',
                    'lavender', 'pink', 'lightgray', 'darkgray', 'lightblue', 'darkblue',
                    'lightgreen', 'darkgreen', 'rosybrown', 'steelblue', 'slateblue',
                    'mediumpurple', 'dodgerblue', 'deepskyblue'
                ]
                
                // Validate hex format OR named color
                if (!hexRegex.test(value) && !namedColors.includes(value.toLowerCase())) {
                    throw new Error("Please select a color from the color picker or enter a valid color name.")
                }
                return true
            }),
        // description is required and must be string
        body("order_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10, max: 1000 })
            .withMessage("Order description is required and must be between 10 and 1000 characters."),

        // estimated price is required and must be a valid number
        body("order_estimated_price")
            .notEmpty()
            .isNumeric()
            .withMessage("Estimated price is required and must be a valid number.")
            .custom((value) => {
                const price = parseFloat(value)
                // Ensure price is positive and reasonable
                if (price < 0 || price > 1000000) {
                    throw new Error("Estimated price must be a positive number and cannot exceed 1,000,000.")
                }
                return true
            }),
    ]
}

/* **************************
 * Check Custom Order Data and return errors or continue to submission
 * ************************** */
validate.checkCustomOrderData = async (req, res, next) => {
    const { order_make, order_model, order_year, order_color, order_description, order_estimated_price } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/custom-order", {
            errors,
            title: "Build Your Custom Vehicle",
            nav,
            order_make,
            order_model,
            order_year,
            order_color,
            order_description,
            order_estimated_price,
        })
        return
    }
    next()
}

module.exports = validate