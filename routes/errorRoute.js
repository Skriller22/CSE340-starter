const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const Error_500Controller = require("../controllers/500Controller")

router.get("/error500", utilities.handleErrors(Error_500Controller.build500error));
module.exports = router;