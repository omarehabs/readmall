function successHandler(res, statusCode, message, payload) {
    return res.status(statusCode).json({
        error: false,
        message,
        payload: { ...payload }
    });
}

module.exports = successHandler;