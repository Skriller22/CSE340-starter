const pool = require("../database/")
const { get } = require("../routes/static")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
* Get all inventory items and classification_name by classification_id
* ************************** */
async function getInventoryByClassificationId(classification_Id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_Id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error " + error)
    }
}

// Export the functions - CRITICAL
module.exports = {getClassifications, getInventoryByClassificationId}