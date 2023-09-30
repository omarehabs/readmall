function generateToken() {
    const time = new Date().valueOf();
    const randomString = require('crypto').randomBytes(16).toString('hex');
    const uuid = require('uuid').v4();
    return time + randomString + uuid;
}

module.exports = generateToken;