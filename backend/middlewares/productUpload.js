import multer from "multer";

const storage = multer.memoryStorage();

const productUpload = multer({
    storage,

    limits: {
        files: 3,
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    }
});

export default productUpload;