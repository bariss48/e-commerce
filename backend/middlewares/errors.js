const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'internal server error';

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
           success:false,
           error: err,
           errMessage: err.message,
           stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}
        error.message = err.message
        //wrong mongoose object id
        if(err.name === 'CastError'){
            const message = `resource not found.Invalid: ${err.path}`
            error = new ErrorHandler(message,400)
        }
        // handling mongose validation error
        if(err.name === 'ValidationError'){
          const message = Object.values(err.errors).map(value => value.message)
          error = new ErrorHandler(message, 400)
        }
        //handle mongoose duplicate email error
        if(err.code === 11000){
            const message = `duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }
        //handle wrong JWT token error
        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON web token invalid'
            error = new ErrorHandler(message, 400)
          }
          //token expire
          if(err.name === 'JsonWebTokenError'){
            const message = 'JSON web token is expired'
            error = new ErrorHandler(message, 400)
          }
          
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal server Error'
        })
    }

}