import express from 'express';
import multer from 'multer';
import path from 'path';
import { getCensusDraft, saveCensusStep, uploadDocument, downloadCertificate } from '../controllers/census.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed.'));
    }
  }
});

router.get('/draft', authenticate, getCensusDraft);
router.post('/save-step', authenticate, saveCensusStep);
router.post('/upload', authenticate, upload.single('document'), uploadDocument);
router.get('/certificate', authenticate, downloadCertificate);

export default router;
