const ErrorMiddleware =(err, req, res, send)=> {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Inernal Eerver Error"
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}

export default ErrorMiddleware;