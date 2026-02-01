const utilities = require("../utilities/")
const accountModel = require("../models/accountModel")
const bcrypt = require("bcryptjs")

/* **************************
* Deliver login View
* *************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "login",
        nav,
        errors: null,
    })
}

/* **************************
 * Validate login
 * ************************** */

async function validateLogin(req, res, next) {
    const { account_Email, account_Password } = req.body
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

    // fetch the account data
    const accountData = await accountModel.getAccountByEmail(account_Email)
    if (!accountData) {
        let nav = await utilities.getNav()
        req.flash("notice", "Please check your credentials and try again.")
        return res.redirect("/account/login")
    }

    // compare passwords
    const passwordMatch = await bcrypt.compare(
        account_Password,
        accountData.account_password
    )
    if (!passwordMatch) {
        req.flash("notice", "Please check your credentials and try again.")
        return res.redirect("/account/login")
    }

    // login successful, set up session
    delete accountData.account_password
    req.session.account = accountData
    req.flash("notice-success", `Welcome back, ${accountData.account_firstname}!`)
    res.redirect("/account/")
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

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_Password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing your registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_Firstname,
        account_Lastname,
        account_Email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice-success",
            `Congratulations, you\'re registered ${account_Firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, there was an error registering your account.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
} 



module.exports = {buildLogin, buildRegister, registerAccount, validateLogin}