module.exports = function (originalname) {
    const time = new Date().valueOf();
    return `${time}-${originalname}`;
};