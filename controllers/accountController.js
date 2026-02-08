const utilities = require("../utilities/")
const accountModel = require("../models/accountModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* **************************
 * Validate login
 * ************************** */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_Email, account_Password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_Email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_Email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_Password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            if(process.env.NODE_ENV === 'developement') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
            }
            else {
                req.flash("message notice", "Please check your credentials and try again")
                res.status(400).render("account/login", {
                    title: "login",
                    nav,
                    errors: null,
                    account_Email,
                })
            }
        } catch (error) {
            throw new Error('Access Forbidden')
        }
}


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin}