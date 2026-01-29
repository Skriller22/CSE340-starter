const invmModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const detailCont = {}

/* ***************************
 *  Build inventory details view
 * ************************** */
detailCont.buildByInventoryId = async (req, res, next) => {
  const inventoryId = req.params.inventoryId;
  const rows = await invmModel.getInventoryByInventoryId(inventoryId);
  const vehicle = rows?.[0];
  const nav = await utilities.getNav();

  if (!vehicle) {
    return res.status(404).render("./errors/error", {
      title: "Vehicle Not Found",
      nav,
      message: "Sorry, we couldn't find that vehicle.",
    });
  }

  res.render("./inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detailView: await utilities.buildDetailsView(vehicle),
  });
};

module.exports = detailCont