const multer = require('multer');
const {join} = require('path')
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
    singleImage: (path, field, maxSizeInMB = 5) => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                console.log(path, 'wherw file got saved')
                req.body.imagePath = path
                console.log(join(__dirname, '..',  path), 'in multer path')
                cb(null, join(__dirname, '..',  path));
            },
            filename: (req, file, cb) => {
                const name = Date.now() + '-' + file.originalname.replace(/\s/g, "")
                req.body.imageName = name
                console.log('in multer 2')
                cb(null, name);
            },
        });

        const limits = {
            fileSize: maxSizeInMB * 1024 * 1024
        };

        return multer({
            storage,
            fileFilter(req, file, callback) {
                const orgName = file.originalname;
                if (!orgName.toLowerCase().match(/\.(png|jpg|jpeg)$/i)) {
                    return callback(new Error('error uploading file'));
                }
                console.log('in multer 3')
                return callback(null, true)
            },
            limits,
        }).single(field)

    },
    singlePdf: (path, field, maxSizeInMB = 5) => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                console.log(path, 'wherw file got saved')
                req.body.pdfPath = path
                console.log(join(__dirname, '..',  path), 'in multer path')
                cb(null, join(__dirname, '..',  path));
            },
            filename: (req, file, cb) => {
                const name = Date.now() + '-' + file.originalname.replace(/\s/g, "")
                req.body.pdfName = name
                console.log('in multer 2')
                cb(null, name);
            },
        });

        const limits = {
            fileSize: maxSizeInMB * 1024 * 1024
        };

        return multer({
            storage,
            fileFilter(req, file, callback) {
                const orgName = file.originalname;
                if (!orgName.toLowerCase().match(/\.(png|jpg|jpeg)$/i)) {
                    return callback(new Error('error uploading file'));
                }
                console.log('in multer 3')
                return callback(null, true)
            },
            limits,
        }).single(field)

    },
    multipleFiles: (path, field, maxSizeInMB = 5) => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                req.body.path = path
                cb(null, join(__dirname, '..',  path));
            },
            filename: (req, file, cb) => {
                const name = Date.now() + '-' + file.originalname.replace(/\s/g, "")
                cb(null, name);
            },
        });

        const limits = {
            fileSize: maxSizeInMB * 1024 * 1024
        };

        return multer({
            storage,
            limits,
        }).array(field, maxCount)

    },
    multipleFields: (path, fields, maxSizeInMB = 5, maxCount) => {

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                req.body.path = path
                cb(null, join(__dirname, '..',  path));
            },
            filename: (req, file, cb) => {
                const name = Date.now() + '-' + file.originalname.replace(/\s/g, "")
                cb(null, name);
            },
        });

        const limits = {
            fileSize: maxSizeInMB * 1024 * 1024
        };

        return multer({
            storage,
            limits,
        }).fields(fields)

    }
};

// module.exports =  {multerConfig} 
