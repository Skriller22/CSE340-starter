const pool = require("../database")

/* ***************************
 * Register a new account
 * ************************** */

async function registerAccount(account_Firstname, account_Lastname, account_Email, hashed_Password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        const values = [account_Firstname, account_Lastname, account_Email, hashed_Password]
        return await pool.query(sql, values)
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Check for existing account
 * ************************** */
async function CheckExistingEmail(account_Email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_Email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* **************************
 *  Log in functions
 * ************************** */
async function getAccountByEmail(account_Email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const account = await pool.query(sql, [account_Email])
        return account.rows[0]
    } catch (error) {
        return error.message
    }
}

// Export the functions - CRITICAL
module.exports = {registerAccount, CheckExistingEmail, getAccountByEmail}