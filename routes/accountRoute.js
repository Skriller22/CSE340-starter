const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process register request
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegistrationData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
// Process logout request
router.get("/logout", (req, res) => {
    res.clearCookie("jwt")
    req.flash("notice-success", "You have been logged out.")
    res.redirect("/account/login")
})

// User Account route
router.get("/user", utilities.checkLogin, utilities.handleErrors(accountController.buildUserPage))

// Build update account view
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdatePage))
// Process account update request
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount)
)
// Process password update request
router.post(
    "/update/password",
    utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;