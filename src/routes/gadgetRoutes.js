const express = require('express');
const router = express.Router();
const {
	getAllGadgets,
	createGadget,
	updateGadget,
	deleteGadget,
	selfDestruct,
} = require('../controllers/gadgetController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Routes accessible to all authenticated users
router.get('/', getAllGadgets);

// Routes requiring admin access
router.post('/', isAdmin, createGadget);
router.patch('/:id', isAdmin, updateGadget);
router.delete('/:id', isAdmin, deleteGadget);
router.post('/:id/self-destruct', isAdmin, selfDestruct);

module.exports = router;
