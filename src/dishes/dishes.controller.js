const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));


function list(req, res){
    res.json({data: dishes})
}

module.exports ={
    list: list,
    read: [dishExists, read],
    create: [reqBodyValidation, create],
    update: [dishExists, reqBodyValidation, idValidation, update],
}