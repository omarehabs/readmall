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
            const contentLength = req.rawHeaders;
            console.log(contentLength);
            limits.fileSize = 10 * 1024 * 1024;
            if (!orgName.toLowerCase().match(/\.(pdf)$/)) {
                return cb(new Error('Please upload a pdf in the pdf field.'));
            }
        }
        if (files.fieldname === 'cover') {
            const contentLength = req.headers['content-length'];
            console.log(contentLength);
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


    // // return multer({ dest: '/uploads' });
    // function limits(req, file, cb) {
    //     // Dynamically set different file size limits for each field (video and image)
    //     if (file.fieldname === 'pdf') {
    //         console.log(file.size);
    //         cb(null, { fileSize: 1024 * 1024 }); // 50MB for videos
    //     } else if (file.fieldname === 'avatar') {
    //         cb(null, { fileSize: 5 * 1024 * 1024 }); // 5MB for images
    //     } else if (file.fieldname === 'cover') {
    //         cb(null, { fileSize: 5 * 1024 * 1024 }); // 5MB for images
    //     } else {
    //         cb(new Error('Invalid fieldname!'));
    //     }
    // }


    return multer({
        storage: storage,
        limits: limits,
        fileFilter
    });
};

module.exports = {
    multerConfig
};