//Handles Image and file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//This code here names the file with a reasonable name instead
//of some random number naming

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'files/');
    },
    filename: function (req, file, callback) {
        const filename = file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        callback(null, filename);
    }
})

const upload2 = multer({
    storage: storage,
    limits: {
        fileSize: 1048576, //1mb
    },
});

module.exports = upload2;
