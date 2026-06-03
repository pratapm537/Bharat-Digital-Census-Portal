import express from 'express';
import { getDashboardStats, listCitizens, getCitizenDetails, reviewCensus } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, authorize('OFFICER'), getDashboardStats);
router.get('/citizens', authenticate, authorize('OFFICER'), listCitizens);
router.get('/citizen/:id', authenticate, authorize('OFFICER'), getCitizenDetails);
router.post('/review/:id', authenticate, authorize('OFFICER'), reviewCensus);

export default router;
