const invModel = require("../models/inventoryModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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
  * Build the classification list 
  * ************************** */
 Util.buildClassificationList = async function (data) {
  let list = '<select id="classificationList" name="classification_id">'
  list += '<option value="">Choose a Classification</option>'
  data.forEach(row => {
    list += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })
  list += '</select>'
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

 /* *****************************
  * Build the inventory view HTML
  * ************************** */
Util.buildInventoryTable = async function (data) {
  let inventoryTable = '<table id="inventory-table">'
  inventoryTable += '<thead><tr><th></th><th>Make</th><th>Model</th><th>Year</th><th>Price</th><th>Class ID</th></tr></thead>'
  inventoryTable += '<tbody>'
  data.forEach(vehicle => {
    inventoryTable += '<tr>'
    inventoryTable += '<td><a href="' + vehicle.inv_image + '" target="_blank">View Image</a></td>'
    inventoryTable += '<td>' + vehicle.inv_make + '</td>'
    inventoryTable += '<td>' + vehicle.inv_model + '</td>'
    inventoryTable += '<td>' + vehicle.inv_year + '</td>'
    inventoryTable += '<td>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</td>'
    inventoryTable += '<td>' + vehicle.classification_id + '</td>'
    inventoryTable += '</tr>'
  })
  inventoryTable += '</tbody></table>'
  return inventoryTable
}

 /* *****************************
  * Build the add inventory view 
  * ************************** */
Util.buildAddInventoryView = async function (data) {
  let addInventoryView = '<div class="add-inventory-view">'
  addInventoryView += '<form action="/inv/add-inventory" method="post">'
  addInventoryView += '<label for="inv_make">Vehicle Make</label>'
  addInventoryView += '<input type="text" id="inv_make" name="inv_make" pattern="[a-zA-Z0-9\s]+" value="' + (data ? data.inv_make || '' : '') + '" required>'
  addInventoryView += '<label for="inv_model">Vehicle Model</label>'
  addInventoryView += '<input type="text" id="inv_model" name="inv_model" pattern="[a-zA-Z0-9\s]+" value="' + (data ? data.inv_model || '' : '') + '" required>'
  addInventoryView += '<label for="inv_year">Vehicle Year</label>'
  addInventoryView += '<input type="text" id="inv_year" name="inv_year" pattern="[0-9]{4}" value="' + (data ? data.inv_year || '' : '') + '" required>'
  addInventoryView += '<label for="inv_description">Vehicle Description</label>'
  addInventoryView += '<textarea id="inv_description" name="inv_description" required>' + (data ? data.inv_description || '' : '') + '</textarea>'
  addInventoryView += '<label for="inv_image">Vehicle Image URL</label>'
  addInventoryView += '<input type="text" id="inv_image" name="inv_image" value="' + (data ? data.inv_image || '' : '') + '" required>'
  addInventoryView += '<label for="inv_thumbnail">Vehicle Thumbnail URL</label>'
  addInventoryView += '<input type="text" id="inv_thumbnail" name="inv_thumbnail" value="' + (data ? data.inv_thumbnail || '' : '') + '" required>'
  addInventoryView += '<label for="inv_price">Vehicle Price</label>'
  addInventoryView += '<input type="text" id="inv_price" name="inv_price" pattern="^[0-9]+(\.[0-9]{1,2})?$" value="' + (data ? data.inv_price || '' : '') + '" required>'
  addInventoryView += '<label for="inv_miles">Vehicle Miles</label>'
  addInventoryView += '<input type="text" id="inv_miles" name="inv_miles" pattern="^[0-9]+$" value="' + (data ? data.inv_miles || '' : '') + '" required>'
  addInventoryView += '<label for="inv_color">Vehicle Color</label>'
  addInventoryView += '<input type="text" id="inv_color" name="inv_color" pattern="[a-zA-Z\s]+" value="' + (data ? data.inv_color || '' : '') + '" required>'
// Build classification select list
  let classPool = await invModel.getClassifications()
  let classifications = 
    '<select name="classification_id" id="classificationList" required>'
  classifications += '<option value="" disabled ' + (data ? '' : 'selected') + '>Select a Classification</option>'
  classPool.rows.forEach((row) => {
    classifications += '<option value="' + row.classification_id + '"'
    if (
      data && data.classification_id == row.classification_id
    ) {
      classifications += " selected"
    }
    classifications += ">" + row.classification_name + "</option>"
  })
  classifications += '</select>'
  addInventoryView += classifications

  addInventoryView += '<button type="submit" class="button">Add Vehicle to Inventory</button>'
  addInventoryView += '</form>'
  addInventoryView += '</div>'
  return addInventoryView
}

 /* *****************************
  * Build the edit inventory view HTML
  * ************************** */
Util.buildEditInventoryView = async function (data) {
  let editInventoryView = '<div class="add-inventory-view">'
  editInventoryView += '<form action="/inv/update" method="post">'
  editInventoryView += `<input type="hidden" name="inv_id" value="${data.inv_id}">`
  editInventoryView += '<label for="inv_make">Vehicle Make</label>'
  editInventoryView += '<input type="text" id="inv_make" name="inv_make" pattern="[a-zA-Z0-9\s]+" value="' + (data ? data.inv_make || '' : '') + '" required>'
  editInventoryView += '<label for="inv_model">Vehicle Model</label>'
  editInventoryView += '<input type="text" id="inv_model" name="inv_model" pattern="[a-zA-Z0-9\s]+" value="' + (data ? data.inv_model || '' : '') + '" required>'
  editInventoryView += '<label for="inv_year">Vehicle Year</label>'
  editInventoryView += '<input type="text" id="inv_year" name="inv_year" pattern="[0-9]{4}" value="' + (data ? data.inv_year || '' : '') + '" required>'
  editInventoryView += '<label for="inv_description">Vehicle Description</label>'
  editInventoryView += '<textarea id="inv_description" name="inv_description" required>' + (data ? data.inv_description || '' : '') + '</textarea>'
  editInventoryView += '<label for="inv_image">Vehicle Image URL</label>'
  editInventoryView += '<input type="text" id="inv_image" name="inv_image" value="' + (data ? data.inv_image || '' : '') + '" required>'
  editInventoryView += '<label for="inv_thumbnail">Vehicle Thumbnail URL</label>'
  editInventoryView += '<input type="text" id="inv_thumbnail" name="inv_thumbnail" value="' + (data ? data.inv_thumbnail || '' : '') + '" required>'
  editInventoryView += '<label for="inv_price">Vehicle Price</label>'
  editInventoryView += '<input type="text" id="inv_price" name="inv_price" pattern="^[0-9]+(\.[0-9]{1,2})?$" value="' + (data ? data.inv_price || '' : '') + '" required>'
  editInventoryView += '<label for="inv_miles">Vehicle Miles</label>'
  editInventoryView += '<input type="text" id="inv_miles" name="inv_miles" pattern="^[0-9]+$" value="' + (data ? data.inv_miles || '' : '') + '" required>'
  editInventoryView += '<label for="inv_color">Vehicle Color</label>'
  editInventoryView += '<input type="text" id="inv_color" name="inv_color" pattern="[a-zA-Z\s]+" value="' + (data ? data.inv_color || '' : '') + '" required>'
// Build classification select list
  let classPool = await invModel.getClassifications()
  let classifications = 
    '<select name="classification_id" id="classificationList" required>'
  classifications += '<option value="" disabled ' + (data ? '' : 'selected') + '>Select a Classification</option>'
  classPool.rows.forEach((row) => {
    classifications += '<option value="' + row.classification_id + '"'
    if (
      data && data.classification_id == row.classification_id
    ) {
      classifications += " selected"
    }
    classifications += ">" + row.classification_name + "</option>"
  })
  classifications += '</select>'
  editInventoryView += classifications

  editInventoryView += '<button type="submit" class="button">Update Vehicle</button>'
  editInventoryView += '</form>'
  editInventoryView += '</div>'
  return editInventoryView
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookies("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData 
        res.locals.loggedin = 1
        next()
      })
    } else {
      next()
  }
}

/* ****************************************
* Check Login
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please Log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util