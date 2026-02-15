const utilities = require('../utilities');
const orderModel = require('../models/orderModel');

/* ***************************
 * Deliver custom order form view
 * ************************** */
async function buildCustomOrderForm(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("inventory/custom-order", {
            title: "Build Your Custom Vehicle",
            nav,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}

/* ***************************
 * Deliver list of user's orders
 * ************************** */
async function buildMyOrders(req, res, next) {
    try {
        let nav = await utilities.getNav();
        // Get the account ID from res.locals (set by JWT middleware)
        const accountId = res.locals.accountData.account_id;

        // Fetch custom orders for the account
        const orders = await orderModel.getCustomOrdersByAccountId(accountId);

        res.render("inventory/my-orders", {
            title: "My Custom Orders",
            nav,
            orders,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}

/* ***************************
 * Deliver order details view
 * ************************** */
async function buildOrderDetails(req, res, next) {
    try {
        const orderId = req.params.orderId;
        let nav = await utilities.getNav();

        // Fetch the specific order details
        const order = await orderModel.getCustomOrderById(orderId);

        if (!order) {
            req.flash("notice", "Order not found.");
            return res.redirect("/custom/my-orders");
        }

        // Ensure the order belongs to the logged-in user OR user is an admin
        if (order.account_id !== res.locals.accountData.account_id && res.locals.accountData.account_type !== "Admin") {
            req.flash("notice", "You do not have permission to view this order.");
            return res.redirect("/custom/my-orders");
        }

        res.render("inventory/order-detail", {
            title: "Order Details",
            nav,
            order,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}

/* **************************
 * Process custom order submission
 * *************************** */
async function submitCustomOrder(req, res, next) {
    try {
        const { order_make, order_model, order_year, order_color, order_description, order_estimated_price } = req.body
        const account_id = res.locals.accountData.account_id
        
        // Create the new order
        const result = await orderModel.createCustomOrder(
            account_id,
            order_make,
            order_model,
            order_year,
            order_color,
            order_description,
            order_estimated_price
        )
        
        if (result) {
            req.flash("notice-success", "Your custom order has been submitted successfully!")
            res.redirect("/custom/my-orders")
        } else {
            req.flash("notice", "Sorry, there was an error submitting your order. Please try again.")
            res.redirect("/custom/new-order")
        }
    } catch (error) {
        next(error)
    }
}

/* ***************************
 * Build delete order confirmation page
 * *************************** */
async function buildDeleteOrderConfirmation(req, res, next) {
    try {
        const orderId = req.params.orderId
        const account_id = res.locals.accountData.account_id
        
        const order = await orderModel.getCustomOrderById(orderId)
        
        if (!order) {
            req.flash("notice", "Order not found.")
            return res.redirect("/custom/my-orders")
        }
        
        if (order.account_id !== account_id && res.locals.accountData.account_type !== "Admin") {
            req.flash("notice", "You do not have permission to delete this order.")
            return res.redirect("/custom/my-orders")
        }
        
        if (order.order_status !== "Pending") {
            req.flash("notice", "You can only delete orders that are still pending.")
            return res.redirect("/custom/my-orders")
        }
        
        let nav = await utilities.getNav()
        res.render("./inventory/delete-order", {
            title: "Delete Order",
            nav,
            order,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 * Delete custom order (now POST handler)
 * *************************** */
async function deleteOrder(req, res, next) {
    try {
        const { order_id } = req.body
        const account_id = res.locals.accountData.account_id
        
        const order = await orderModel.getCustomOrderById(order_id)
        
        if (!order) {
            req.flash("notice", "Order not found.")
            return res.redirect("/custom/my-orders")
        }
        
        if (order.account_id !== account_id && res.locals.accountData.account_type !== "Admin") {
            req.flash("notice", "You do not have permission to delete this order.")
            return res.redirect("/custom/my-orders")
        }
        
        if (order.order_status !== "Pending") {
            req.flash("notice", "You can only delete orders that are still pending.")
            return res.redirect("/custom/my-orders")
        }
        
        await orderModel.deleteCustomOrder(order_id)
        req.flash("notice-success", "Your order has been deleted.")
        res.redirect("/custom/my-orders")
    } catch (error) {
        next(error)
    }
}

/* ***************************
 * Build admin orders management view (accessible to employees and admins)
 * *************************** */
async function buildAdminOrders(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const orders = await orderModel.getAllCustomOrders();
        const isAdmin = res.locals.accountData.account_type === 'Admin';
        
        res.render("inventory/admin-orders", {
            title: "Custom Orders Management",
            nav,
            orders,
            isAdmin,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}

/* ***************************
 * Update order status (admin)
 * *************************** */
async function updateOrderStatusAdmin(req, res, next) {
    try {
        const { order_id, order_status } = req.body;
        
        const result = await orderModel.updateOrderStatus(order_id, order_status);
        
        if (result) {
            req.flash("notice-success", `Order status updated to ${order_status}.`);
        } else {
            req.flash("notice", "Error updating order status.");
        }
        
        res.redirect("/custom/admin/orders");
    } catch (error) {
        next(error);
    }
}

/* ***************************
 * Add notes to order (admin)
 * *************************** */
async function addOrderNotes(req, res, next) {
    try {
        const { order_id, order_notes } = req.body;
        
        // You may need to add a model function for this
        // For now, assuming updateOrderStatus can handle notes too
        const sql = `UPDATE public.custom_order 
                     SET order_notes = $1 
                     WHERE order_id = $2 
                     RETURNING *`;
        const values = [order_notes, order_id];
        
        const result = await pool.query(sql, values);
        
        if (result.rowCount > 0) {
            req.flash("notice-success", "Notes added successfully.");
        } else {
            req.flash("notice", "Error adding notes.");
        }
        
        res.redirect("/custom/admin/orders");
    } catch (error) {
        next(error);
    }
}

module.exports = { buildCustomOrderForm, buildMyOrders, buildOrderDetails, submitCustomOrder, buildDeleteOrderConfirmation, deleteOrder, buildAdminOrders, updateOrderStatusAdmin, addOrderNotes }