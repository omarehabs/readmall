async function errorCtrl(err, req, res, next) {
    console.log('from error controller', err.message);
    return res.status(400).json({
        error: true,
        message: err.message,
        err
    });
}

module.exports = {
    errorCtrl
};