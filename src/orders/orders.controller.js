const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));


function list(req, res, next){
    res.json({data : orders})
}

module.exports ={
    list: list,
    read: [orderExists, read],
    create: [reqBodyValidation, create],
    update: [orderExists, reqBodyValidation, statusNotDelivered, idValidation, update],
    remove: [orderExists, statusPending, remove],
}