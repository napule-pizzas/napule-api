const multer = require('multer');

// @@ TODO: configure file upload settings!
const upload = multer({
  dest: './uploads'
}).single('file');

module.exports = {
  upload
};
