const invModel = require("../models/inventoryModel")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul id='nav-menu'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* *****************************
 * Build the classification view HTML
 * ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + ' details"><img src="' + vehicle.inv_thumbnail
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" /></a>'
      grid += '<div class="name-price">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* *****************************
  * Build the details view HTML
  * ************************** */
Util.buildDetailsView = async function (data) {
  let detailView = '<div id="detail-view">'
  detailView += '<div id="detail-panel">'
  detailView += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
  detailView += '<div class="thumbnails">'
  detailView += '<img src="' + data.inv_thumbnail + '" alt="Thumbnail image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
  detailView += '<img src="' + data.inv_thumbnail + '" alt="Thumbnail image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
  detailView += '<img src="' + data.inv_thumbnail + '" alt="Thumbnail image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
  detailView += '<img src="' + data.inv_thumbnail + '" alt="Thumbnail image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
  detailView += '</div>'
  detailView += '</div>'
  detailView += '<div id="detail-info">'
  detailView += '<div class="detail-header">'
  detailView += '<h2>' + data.inv_make + ' ' + data.inv_model + '</h2>'
  detailView += '<h3 class="price">$' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</h3>'
  detailView += '</div>'
  detailView += '<p>' + data.inv_description + '</p>'
  detailView += '<ul>'
  detailView += '<li>Color: ' + data.inv_color + '</li>'
  detailView += '<li>Year: ' + data.inv_year + '</li>'
  detailView += '<li>Miles: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</li>'
  detailView += '</ul>'
  detailView += '</div>'
  detailView += '</div>'
  return detailView
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util