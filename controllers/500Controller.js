const utilities = require("../utilities/")
const Error_500Controller = {}

Error_500Controller.build500error = async function(req, res, next){
  const error = new Error("Intentional 500 error for testing")
  error.status = 500
  throw error
}

module.exports = Error_500Controller