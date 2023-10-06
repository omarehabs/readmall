const multer = require('multer');

function multerConfig() {
    const storage = multer.memoryStorage();

    const limits = {
        fileSize: 10 * 1024 * 1024
    };

    const fileFilter = function (req, files, cb) {
        const orgName = files.originalname;
        const size = files.size;
        if (files.fieldname === 'pdf') {
            limits.fileSize = 10 * 1024 * 1024;
            if (!orgName.toLowerCase().match(/\.(pdf)$/)) {
                return cb(new Error('Please upload a pdf in the pdf field.'));
            }
        }
        if (files.fieldname === 'cover') {
            if (!orgName.toLowerCase().match(/\.(png|jpg|jpeg)$/) || size <= 2 * 1024 * 1024) {
                return cb(new Error('Please upload a book cover image in the cover field allowed images are png, jpeg and jpg.'));
            }
        }
        if (files.fieldname === 'avatar') {
            if (!orgName.toLowerCase().match(/\.(png|jpg|jpeg)$/)) {
                return cb(new Error('Please upload an image in the avatar field allowed images are png, jpeg and jpg.'));
            }
        }
        cb(undefined, true);
    };


    return multer({
        storage: storage,
        limits: limits,
        fileFilter
    });
};

module.exports = {
    multerConfig
};