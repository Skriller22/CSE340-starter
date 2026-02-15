const pool = require("../database/")

/* ***************************
* Get all custom orders with customer info
* ************************** */
async function getAllCustomOrders() {
    try {
        const data = await pool.query(`
            SELECT 
                co.*,
                a.account_firstname,
                a.account_lastname,
                a.account_email
            FROM public.custom_order AS co
            JOIN public.account AS a ON co.account_id = a.account_id
            ORDER BY co.order_date DESC
        `)
        return data.rows
    } catch (error) {
        console.error("Error fetching custom orders:", error)
        return []
    }
}

/* ***************************
* Get custom order by account_id
* ************************** */
async function getCustomOrdersByAccountId(account_Id) {
    try {
        const data = await pool.query("SELECT * FROM public.custom_order WHERE account_id = $1 ORDER BY order_date DESC", [account_Id])
        return data.rows
    } catch (error) {
        console.error("Error fetching custom orders by account ID:", error)
        return []
    }
}

/* ***************************
 * Get single custom order by order_id
 * ************************** */
async function getCustomOrderById(order_Id) {
    try {
        const data = await pool.query("SELECT * FROM public.custom_order WHERE order_id = $1", [order_Id])
        return data.rows[0]
    } catch (error) {
        console.error("Error fetching custom order by ID:", error)
        return null
    }
}

/* ***************************
 * Create a new custom order
 * ************************** */
async function createCustomOrder(
    account_id,
    order_make,
    order_model,
    order_year,
    order_color,
    order_description,
    order_estimated_price
){
    try {
        const sql = `INSERT INTO public.custom_order 
                     (account_id, order_make, order_model, order_year, order_color, order_description, order_estimated_price, order_status, order_date) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', NOW()) 
                     RETURNING *`
        const values = [account_id, order_make, order_model, order_year, order_color, order_description, order_estimated_price]
        const result = await pool.query(sql, values)
        return result.rows[0]
    } catch (error) {
        console.error("createCustomOrder error: " + error)
        return error.message
    }
}

/* ***************************
 * Update custom order status
 * ************************** */
async function updateOrderStatus(order_id, order_status){
    try {
        const sql = `UPDATE public.custom_order 
                     SET order_status = $1 
                     WHERE order_id = $2 
                     RETURNING *`
        const values = [order_status, order_id]
        const result = await pool.query(sql, values)
        return result.rows[0]
    } catch (error) {
        console.error("updateOrderStatus error: " + error)
        return error.message
    }
}

/* ***************************
 * Delete custom order
 * ************************** */
async function deleteCustomOrder(order_id){
    try {
        const sql = `DELETE FROM public.custom_order WHERE order_id = $1`
        return await pool.query(sql, [order_id])
    } catch (error) {
        console.error("deleteCustomOrder error: " + error)
        return error.message
    }
}

// Export functions
module.exports = { getAllCustomOrders, getCustomOrdersByAccountId, getCustomOrderById, createCustomOrder, updateOrderStatus, deleteCustomOrder }