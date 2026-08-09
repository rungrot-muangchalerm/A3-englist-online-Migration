const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_ROOT = path.resolve(__dirname, '../../../../../../assets/uploads/ckeditor');
const PUBLIC_ROOT = '/assets/uploads/ckeditor';

const ALLOWED_FILES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/zip', 'application/x-rar-compressed', 'audio/mpeg', 'video/mp4'];
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function makeSafeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9\u0E00-\u0E7F_-]/g, '_');
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${unique}${ext}`;
}

function buildStorage(type) {
  const subFolder = type === 'Images' ? 'images' : 'files';
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(UPLOAD_ROOT, subFolder);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      cb(null, makeSafeFilename(file.originalname));
    },
  });
}

function fileFilter(type) {
  return (req, file, cb) => {
    if (type === 'Images') {
      return cb(null, ALLOWED_IMAGES.includes(file.mimetype));
    }
    return cb(null, ALLOWED_FILES.includes(file.mimetype));
  };
}

function buildUpload(type) {
  return multer({
    storage: buildStorage(type),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter(type),
  }).single('upload');
}

function sendCkeCallback(res, funcNum, fileUrl, message) {
  const html = `<!DOCTYPE html>
<html>
<body>
<script type="text/javascript">
window.parent.CKEDITOR.tools.callFunction(${Number(funcNum) || 0}, ${JSON.stringify(fileUrl)}, ${JSON.stringify(message || '')});
</script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}

function sendCkeJson(res, ok, fileUrl, fileName, message) {
  if (!ok) {
    return res.status(200).json({
      uploaded: 0,
      error: { message: message || 'Upload failed' },
    });
  }
  return res.status(200).json({
    uploaded: 1,
    fileName: fileName || path.basename(fileUrl),
    url: fileUrl,
  });
}

function respond(type, req, res, ok, fileUrl, fileName, message) {
  if (req.query && req.query.CKEditorFuncNum) {
    return sendCkeCallback(res, req.query.CKEditorFuncNum, fileUrl || '', message || '');
  }
  return sendCkeJson(res, ok, fileUrl, fileName, message);
}

function handleUpload(type) {
  return (req, res, next) => {
    if (!req.session || !req.session.adminId || req.session.adminType !== 'office') {
      return respond(type, req, res, false, '', '', 'Unauthorized');
    }

    const upload = buildUpload(type);
    return upload(req, res, (err) => {
      if (err) {
        console.error(err);
        return respond(type, req, res, false, '', '', err.message || 'Upload failed');
      }

      if (!req.file) {
        return respond(type, req, res, false, '', '', 'No file received');
      }

      const subFolder = type === 'Images' ? 'images' : 'files';
      const publicUrl = `${PUBLIC_ROOT}/${subFolder}/${req.file.filename}`;
      return respond(type, req, res, true, publicUrl, req.file.originalname, '');
    });
  };
}

module.exports = {
  uploadFile: handleUpload('Files'),
  uploadImage: handleUpload('Images'),
};
