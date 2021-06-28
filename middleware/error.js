const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req,res, next)=> {
    // Log to console for developer
    // console.log(err.stack.red);
    let error = {...err};

    // console.log(err);

    // Mongose bad ObjectID
    if(err.name === 'CastError'){
        const message = `Resourse not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered' + err.KeyValue;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    

    res.status(err.statusCode || 500).json({
        success : false,
        error : err.message || 'Server Error'
    })
}


module.exports = errorHandler;