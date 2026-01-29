const utilities = require("../utilities/")
const accountModel = require("../models/accountModel")

/* **************************
* Deliver login View
* *************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "login",
        nav,
    })
}

/* **************************
* Deliver register View
* *************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "register",
        nav,
        errors: null,
    })
}

/* **************************
* Register Account
* *************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_Firstname, account_Lastname, account_Email, account_Password } = req.body

    const regResult = await accountModel.registerAccount(
        account_Firstname,
        account_Lastname,
        account_Email,
        account_Password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_Firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, there was an error registering your account.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
} 



module.exports = {buildLogin, buildRegister, registerAccount}