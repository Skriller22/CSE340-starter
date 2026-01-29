const pool = require("../database")

/* ***************************
    * Register a new account
    * ************************** */

async function registerAccount(account_Firstname, account_Lastname, account_Email, hashed_Password){
    try {
        const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type, account_created) VALUES ($1, $2, $3, $4, 'customer', CURRENT_TIMESTAMP) RETURNING account_id"
        const values = [account_Firstname, account_Lastname, account_Email, hashed_Password]
        return await pool.query(sql, values)
    } catch (error) {
        return error.message
    }
}

// Export the functions - CRITICAL
module.exports = {registerAccount}