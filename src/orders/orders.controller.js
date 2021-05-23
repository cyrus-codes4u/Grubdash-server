const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

/** Validation Middleware **/
//Checks that an order exists (PUT, DELETE, GET orders/:orderId methods)
function orderExists (req,res,next) {
    const { orderId } = req.params
    res.locals.index = orders.findIndex((order) => order.id === orderId)

    //orderId exists and there is an order with that id in the array (of index res.locals.index)
    if(orderId && res.locals.index !== -1){
        return next()
    }
    next({
        status: 404,
        message: `Order with ID: ${orderId} not found`,
    })
}


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