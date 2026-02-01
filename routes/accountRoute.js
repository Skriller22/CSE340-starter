const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegistrationData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process login request
router.post(
    "/login",
    (req, res) => {
        res.status(200).send("login process")
    }
)

module.exports = router;