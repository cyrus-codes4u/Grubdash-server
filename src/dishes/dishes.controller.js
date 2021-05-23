const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

/**   Validation middleware  **/
//check that a route parameter is given and matches existing record
function dishExists(req,res,next){
    const {dishId} = req.params
    res.locals.index = dishes.findIndex((dish) => dish.id === dishId)

    //dishId exists and there is a dish with that id in the array (of index res.locals.index)
    if (dishId && res.locals.index !== -1) {
        return next()
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}.`
    })
}

//general reqest body validation 
function reqBodyValidation(req,res,next){
    //stores the new dish info in res.locals
    res.locals.newDish = req.body.data
    const { name, description, image_url, price } = res.locals.newDish
    // has correct name property
    if(!name || name.length < 1) {
        return next({
            status: 400,
            message: "Dish must include a name"
        })
    }
    // has correct description property
    if(!description || description.length < 1) {
        return next({
            status: 400,
            message: "Dish must include a description"
        })
    }
    // has correct image_url property
    if(!image_url || image_url.length < 1) {
        return next({
            status: 400,
            message: "Dish must include a image_url"
        })
    }
    // has correct price property
    if(!price){
        return next({
            status: 400,
            message: "Dish must include a price"
        })
    }
    if(!Number.isInteger(price) || price <=0){
        return next({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0"
        })
    }
    next()
}

//additional validation for update requests
function idValidation(req,res,next){
    //checks if the new dish info contains an id
    const { id } = res.locals.newDish
    const {dishId} = req.params
    //If there is no id property in body or id equals dishId, continue 
    if(!id || dishId === id) { 
        res.locals.newDish.id = dishId
        return next()
    }
    //Else throw error
    next({
        status:400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
    })
}

/**   Route Handlers  **/
function read(req, res){
    res.status(200).json({data: dishes[res.locals.index]})
}
function update(req, res, next){
    dishes[res.locals.index] = res.locals.newDish
    res.json({data: dishes[res.locals.index] })
}
function create(req, res, next){
    res.locals.newDish.id = nextId()
    dishes.push(res.locals.newDish)
    res.status(201).json({ data: dishes.slice(-1)[0] })
}

function list(req, res){
    res.json({data: dishes})
}

module.exports ={
    list: list,
    read: [dishExists, read],
    create: [reqBodyValidation, create],
    update: [dishExists, reqBodyValidation, idValidation, update],
}