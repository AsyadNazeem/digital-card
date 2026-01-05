import express from 'express';
import { trackView, trackClick, getDashboard, getContactAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public tracking endpoints (no auth required)
router.post('/view/:phone', trackView);
router.post('/click/:phone', trackClick);

// Protected analytics endpoints (require authentication)
router.get('/dashboard', authenticateToken, getDashboard);
router.get('/contact/:contactId', authenticateToken, getContactAnalytics);

export default router;
