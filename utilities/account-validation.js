const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/accountModel")
  const validate = {}

/* **************************
*  Validate Registration Data
* ************************** */
validate.registrationRules = () => {
    return [
        // valid email is required and must be unique
        body("account_Email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_Email) => {
                const emailExists = await accountModel.CheckExistingEmail(account_Email)
                if (emailExists > 0) {
                    throw new Error("Email already in use.")
                }
            }),
        // First name is required and must be string
        body("account_Firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("First name is required."), 

        // Last name is required and must be string
        body("account_Lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Last name is required."),

        // Email must be valid format
        body("account_Email")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("A valid email is required."),

        // Password must be strong password
        body("account_Password")
            .trim()
            .escape()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password must be at least 12 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
    ]
}



/* **************************
*  Check data and return errors or continue to register account
* ************************** */
validate.checkRegistrationData = async (req, res, next) => {
    const { account_Firstname, account_Lastname, account_Email } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_Firstname,
            account_Lastname,
            account_Email,
        })
        return
    }
    next()
}

/* **************************
*  Validate Login data
* ************************** */
validate.loginRules = () => {
    return [
        // Valid email input
        body("account_Email")
            .trim()
            .isEmail()
            .escape()
            .withMessage("A valid email is required."),
        // Password is not empty
        body("account_Password")
            .notEmpty()
            .escape()
            .withMessage("Password cannot be empty"),
    ]
}

/* **************************
*  Check login for errors
* ************************** */
validate.checkLoginData = async (req, res, next) => {
    const {account_Email} = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_Email,
        })
        return
    }
    next()
}

/* **************************
*  Validate update account data
* ************************** */
validate.updateAccountRules = () => {
    return [
        // valid email is required and must be unique (excluding current user's email)
        body("account_Email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_Email, { req }) => {
                const currentEmail = req.body.account_Email
                const emailExists = await accountModel.CheckExistingEmail(account_Email)
                // Only throw error if a different account has this email
                if (emailExists > 0) {
                    const existingAccount = await accountModel.getAccountByEmail(account_Email)
                    if (existingAccount && existingAccount.account_id != req.body.account_Id) {
                        throw new Error("Email already in use.")
                    }
                }
            }),
        // First name is required and must be string
        body("account_FirstName")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("First name is required."),

        // Last name is required and must be string
        body("account_LastName")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Last name is required."),
    ]
}

/* **************************
*  Check update account data for errors
* ************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
    const {account_Email, account_FirstName, account_LastName, account_Id} = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_Email,
            account_FirstName,
            account_LastName,
            account_Id,
        })
        return
    }
    next()
}

/* **************************
*  Validate Password Update Data
* ************************** */
validate.updatePasswordRules = () => {
    return [
        // Password must follow strong password rules
        body("account_Password")
            .trim()
            .escape()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password must be at least 12 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
    ]
}

/* **************************
*  Check password update data for errors
* ************************** */
validate.checkPasswordUpdateData = async (req, res, next) => {
    const {account_Id} = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_Id,
        })
        return
    }
    next()
}

/* **************************
* Update account type rules (admin only)
* ************************** */
validate.updateAccountTypeRules = () => {
    return [
        // Account type must be one of the allowed values
        body("account_Type")
            .trim()
            .escape()
            .notEmpty()
            .isIn(["Customer", "Employee", "Admin"])
            .withMessage("Invalid account type."),
    ]
}

/* **************************
*  Check account type update data for errors (admin only)
* ************************** */
validate.checkUpdateAccountTypeData = async (req, res, next) => {
    const {account_Id} = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/manage", {
            errors,
            title: "Manage Accounts",
            nav,
            account_Id,
        })
        return
    }
    next()
}

module.exports = validate
