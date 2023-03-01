const multer = require("multer");
const path = require("path");
module.exports = function uploadImage(route) {
  const storage = multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, path.join(__dirname, "..", "images/" + route));
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Images Only!");
      }
    },
  });
  return upload;
};
