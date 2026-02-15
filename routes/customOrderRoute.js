const express = require('express');
const router = express.Router();
const customOrderController = require('../controllers/customOrderController');
const utilities = require('../utilities');
const customOrderValidation = require('../utilities/custom-order-validation');

// Build custom order form view - requires login
router.get('/new-order', utilities.checkLogin, utilities.handleErrors(customOrderController.buildCustomOrderForm));
// Display list of user's custom orders - requires login
router.get('/my-orders', utilities.checkLogin, utilities.handleErrors(customOrderController.buildMyOrders));
// Display details of a specific order - requires login
router.get('/order/:orderId', utilities.checkLogin, utilities.handleErrors(customOrderController.buildOrderDetails));
// Show delete confirmation page - requires login
router.get('/delete/:orderId', utilities.checkLogin, utilities.handleErrors(customOrderController.buildDeleteOrderConfirmation));
// Employee/Admin: View all custom orders (read-only for employees) - requires employee+
router.get('/admin/orders', utilities.checkLogin, [utilities.checkEmployee], utilities.handleErrors(customOrderController.buildAdminOrders));

// Process new custom order form submission - requires login, validation, then submission
router.post('/new-order', 
    utilities.checkLogin, 
    customOrderValidation.customOrderRules(),
    customOrderValidation.checkCustomOrderData, 
    utilities.handleErrors(customOrderController.submitCustomOrder)
);

// Admin only: Update order status
router.post('/admin/update-status', utilities.checkLogin, [utilities.checkAdmin], utilities.handleErrors(customOrderController.updateOrderStatusAdmin));

// Admin: Add notes to order
router.post('/admin/add-notes', utilities.checkLogin, [utilities.checkAdmin], utilities.handleErrors(customOrderController.addOrderNotes));

// Process delete custom order - requires login
router.post('/delete-confirmed', utilities.checkLogin, utilities.handleErrors(customOrderController.deleteOrder));

module.exports = router;