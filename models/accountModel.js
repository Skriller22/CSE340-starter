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
        const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1'
        const result = await pool.query(sql, [account_Email])
        return result.rows[0]
    }   catch (error) {
        return new Error("No matching email found")
    }
}

/* ***************************
 * Update account information
 * ************************** */
async function updateAccount(account_Id, account_Email, account_FirstName, account_LastName) {
    try {
        const sql = "UPDATE account SET account_email = $1, account_firstname = $2, account_lastname = $3 WHERE account_id = $4 RETURNING *"
        const values = [account_Email, account_FirstName, account_LastName, account_Id]
        const result = await pool.query(sql, values)
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Update account password
 * ************************** */
async function updatePassword(account_Id, hashedPassword) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const values = [hashedPassword, account_Id]
        const result = await pool.query(sql, values)
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Get all accounts (admin)
 * ************************** */
async function getAllAccounts() {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account ORDER BY account_id"
        const result = await pool.query(sql)
        return result.rows
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Get account by ID
 * ************************** */
async function getAccountById(account_Id) {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1"
        const result = await pool.query(sql, [account_Id])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Update account type (admin only)
 * ************************** */
async function updateAccountType(account_Id, account_Type) {
    try {
        const sql = "UPDATE account SET account_type = $1 WHERE account_id = $2 RETURNING *"
        const values = [account_Type, account_Id]
        const result = await pool.query(sql, values)
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Delete account (admin only)
 * ************************** */
async function deleteAccount(account_Id) {
    try {
        const sql = "DELETE FROM account WHERE account_id = $1"
        const values = [account_Id]
        const result = await pool.query(sql, values)
        return result.rowCount > 0  // Returns true if a row was deleted
    } catch (error) {
        return error.message
    }
}

async function countAdmins() {
    try {
        const sql = "SELECT COUNT(*) as count FROM account WHERE account_type = 'Admin'"
        const result = await pool.query(sql)
        return parseInt(result.rows[0].count)
    } catch (error) {
        return error.message
    }
}

// Export the functions - CRITICAL
module.exports = {registerAccount, CheckExistingEmail, getAccountByEmail, updateAccount, updatePassword, getAllAccounts, updateAccountType, deleteAccount, getAccountById, countAdmins}