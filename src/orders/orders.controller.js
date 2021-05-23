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

//general request body Validation
function reqBodyValidation(req,res,next){
    res.locals.newOrder = req.body.data // this should be an order without an ID 
    const { deliverTo, mobileNumber, dishes } = res.locals.newOrder
     // has correct deliverTo property
    if(!deliverTo || deliverTo.length < 1) {
        return next({
            status: 400,
            message: "Order must include a deliverTo"
        })
    }
    // has correct mobileNumber property
    if(!mobileNumber || mobileNumber.length < 1) {
        return next({
            status: 400,
            message: "Order must include a mobileNumber"
        })
    }
    // has dishes property in correct data structure
    if(!dishes || !Array.isArray(dishes) || dishes.length < 1) {
        return next({
            status: 400,
            message: "Order must include at least one dish"
        })
    }
    // all dishes have correct quantity property 
    const incorrectIndex = dishes
                    .findIndex(({quantity}) => !quantity || !Number.isInteger(quantity) || quantity <= 0)
    if(incorrectIndex !== -1){
        return next({
            status: 400,
            message: `Dish ${incorrectIndex} must have a quantity that is an integer greater than 0`,
        })  
    }
    next()
}

//PUT addditional validation
function statusNotDelivered(req,res,next){
    const { status } = res.locals.newOrder
    const existingStatus = orders[res.locals.index].status
    const validStatus = ["pending", "prepared", "out-for-delivery", "delivered"]
    // if the status from request exists / is not empty 
    if(status && status.length > 0 && validStatus.includes(status)) {
        // AND the existing status is not 'delivered'
        if( existingStatus !== "delivered" ){
            return next() 
        }
        return next({
            status: 400,
            message: "A delivered order cannot be changed"
        })
    }
    //when updated status is not valid
    next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
    })
}

function idValidation(req, res, next){
    const { id } = res.locals.newOrder
    const {orderId} = req.params
    //If there is no id property in body or id equals orderId, continue 
    if(!id || orderId === id) { 
        res.locals.newOrder.id = orderId
        return next()
    }
    //Else throw error
    next({
        status:400,
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`
    })
}

function update(req, res, next){
    orders[res.locals.index] = res.locals.newOrder
    res.json({data: orders[res.locals.index] })
}
function create(req,res){
    res.locals.newOrder.id = nextId()
    orders.push(res.locals.newOrder)
    res.status(201).json({ data: orders.slice(-1)[0] })
}
function read(req, res, next){
    res.status(200).json({data: orders[res.locals.index]})
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