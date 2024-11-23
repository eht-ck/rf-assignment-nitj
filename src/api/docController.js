const multer = require('multer');
const path = require('path');
const fs = require('fs');
const conversionService = require('../services/conversionService');

const uploadDir = 'uploads/';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = '-' + Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + uniqueSuffix);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only DOCX files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadFile = [upload.single('file'), (req, res, next) => {
    if (req.file) {
        conversionService.convertDocToPdf(req.file.path, (err, pdfPath) => {
            if (err) {
                console.error('Error converting file:', err);
                return res.status(500).send('Failed to convert document to PDF.');
            }
            res.download(pdfPath, (downloadErr) => {
                if (downloadErr) {
                    console.error('Error downloading file:', downloadErr);
                    next(downloadErr);
                }
            });
        });
    } else {
        res.status(400).send('No file uploaded.');
    }
}];
